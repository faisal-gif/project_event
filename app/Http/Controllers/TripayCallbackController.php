<?php

namespace App\Http\Controllers;

use App\Mail\PaymentSuccessfulMail;
use App\Models\Transaction;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TripayCallbackController extends Controller
{
   public function handle(Request $request, TicketService $ticketService)
    {
        // 1. Ambil data dari request
        $callbackSignature = $request->server('HTTP_X_CALLBACK_SIGNATURE');
        $json = $request->getContent(); // Ambil raw JSON untuk validasi
        $privateKey = env('TRIPAY_PRIVATE_KEY'); // Pastikan kamu set ini di .env

        // 2. Cek apakah header signature ada
        if (!$callbackSignature) {
            Log::warning('Tripay callback: Tidak ada signature');
            return response()->json(['success' => false, 'message' => 'No signature provided'], 403);
        }

        // 3. Validasi keaslian signature (CRITICAL)
        $signature = hash_hmac('sha256', $json, $privateKey);
        if ($signature !== (string) $callbackSignature) {
            Log::warning('Tripay callback: Invalid signature', ['ip' => $request->ip()]);
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        // 4. Decode JSON setelah dipastikan aman
        $data = json_decode($json);
        $reference = $data->reference ?? null;
        $status = $data->status ?? null;

        // Cari transaksi
        $transaction = Transaction::where('reference', $reference)->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        // Jika transaksi sudah memiliki status PAID sebelumnya, abaikan agar tidak double proses
        if ($transaction->status === 'PAID') {
            return response()->json(['success' => true, 'message' => 'Already paid']);
        }

        DB::beginTransaction();

        try {
            // Update status transaksi
            $transaction->status = $status;
            
            // 5. Hanya update paid_at jika statusnya PAID
            if ($status === 'PAID') {
                $transaction->paid_at = now();
                
                // Panggil service untuk membuat tiket
                $ticketService->issueTicket($transaction);
            }
            
            $transaction->save();
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tripay callback error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Internal server error'], 500);
        }

        // 6. Kirim email di luar DB Transaction agar aman
        if ($status === 'PAID') {
            $emailData = $transaction->load('user', 'event');
            // Ubah send() menjadi queue()
            Mail::to($emailData->user->email)->queue(new PaymentSuccessfulMail($emailData));
        }

        return response()->json(['success' => true]);
    }
}
