<?php

namespace App\Http\Controllers;


use App\Models\Transaction;
use App\Services\TicketService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class TripayCallbackController extends Controller
{
    public function handle(Request $request, TicketService $ticketService)
    {
        // Cek signature dari Tripay
        $callbackSignature = $request->server('HTTP_X_CALLBACK_SIGNATURE');


        if (!$callbackSignature) {
            Log::warning('Tripay callback invalid signature');
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        $data = $request->all();

        // Validasi status dan reference
        $reference = $data['reference'] ?? null;
        $status = $data['status'] ?? null;

        DB::beginTransaction();
        $transaction = Transaction::where('reference', $reference)->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        // Update status transaksi
        $transaction->status = $status;
        $transaction->paid_at = now();
        $transaction->save();

        DB::commit();

        // Jika dibutuhkan, buat data tiket atau akses user setelah bayar sukses
        if ($status === 'PAID') {
            DB::beginTransaction();
            // Panggil service untuk membuat tiket
            $ticketService->issueTicket($transaction);
            DB::commit();
        }

        return response()->json(['success' => true]);
    }
}
