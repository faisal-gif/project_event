<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TripayCallbackController extends Controller
{
    public function handle(Request $request)
    {
        // Cek signature dari Tripay
        $callbackSignature = $request->header('HTTP_X_CALLBACK_SIGNATURE');
        $json = $request->getContent();
        $signature = hash_hmac('sha256', $json, env('TRIPAY_PRIVATE_KEY'));

        return response()->json(['callback' => $callbackSignature, 'signature' => $signature, 'json' => $json], 200);

        if ($signature !== $callbackSignature) {
            Log::warning('Tripay callback invalid signature');
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        $data = $request->all();

        // // Validasi status dan reference
        // $reference = $data['reference'] ?? null;
        // $status = $data['status'] ?? null;

        // DB::beginTransaction();
        // $transaction = Transaction::where('reference', $reference)->first();

        // if (!$transaction) {
        //     return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        // }

        // // Update status transaksi
        // $transaction->status = $status;
        // $transaction->paid_at = now();
        // $transaction->save();

        // DB::commit();

        // // Jika dibutuhkan, buat data tiket atau akses user setelah bayar sukses
        // if ($status === 'PAID') {
        //     DB::beginTransaction();

        //     $code = strtoupper(uniqid('TKT'));

        //     $qr = QrCode::format('png')->generate(route('tickets.used',['code' => $code]));
        //     $qrImageName = $code . '.png';

        //     $path = $qr->store($qrImageName, 'public');

        //     $tiket = Ticket::create([
        //         'user_id' => $transaction->user_id,
        //         'event_id' => $transaction->event_id,
        //         'ticket_code' => $code,
        //         'qr_image' => $path,
        //         'transaction_id' => $transaction->id,
        //         'quantity' => $transaction->quantity,
        //         'status' => 'unused',
        //     ]);

        //     DB::commit();
        // }

        return response()->json(['success' => true]);
    }
}
