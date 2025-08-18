<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TripayCallbackController extends Controller
{
    public function handle(Request $request)
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

            $code = strtoupper(uniqid('TKT'));

            $qr = QrCode::format('png')->size(100)->generate($code);
            $qrImageName = 'qr/' . $code . '.png';

            Storage::disk('public')->put($qrImageName, $qr);

            $tiket = Ticket::create([
                'user_id' => $transaction->user_id,
                'event_id' => $transaction->event_id,
                'detail_pendaftar_id' => $transaction->detail_pendaftar_id,
                'ticket_code' => $code,
                'qr_image' => $qrImageName,
                'transaction_id' => $transaction->id,
                'quantity' => $transaction->quantity,
                'status' => 'unused',
            ]);

            $event = $transaction->event;
            $event->update(['remainingQuota' => $event->remainingQuota - $transaction->quantity]);

            DB::commit();
        }

        return response()->json(['success' => true]);
    }
}
