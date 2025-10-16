<?php

namespace App\Http\Controllers;

use App\Models\EventField;
use App\Models\EventFieldResponse;
use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TripayCallbackController extends Controller
{
    protected $privateKey = 'Pc31aRKKzWaJxWmeIn9740kwzLbFm3Hl3fvD24T0';

    public function handle(Request $request)
    {
        $callbackSignature = $request->server('HTTP_X_CALLBACK_SIGNATURE');
        $json = $request->getContent();
        $signature = hash_hmac('sha256', $json, $this->privateKey);

        if ($signature !== (string) $callbackSignature) {
            return Response::json([
                'success' => false,
                'message' => 'Invalid signature',
            ]);
        }

        if ('payment_status' !== (string) $request->server('HTTP_X_CALLBACK_EVENT')) {
            return Response::json([
                'success' => false,
                'message' => 'Unrecognized callback event, no action was taken',
            ]);
        }

        $data = json_decode($json);

        if (JSON_ERROR_NONE !== json_last_error()) {
            return Response::json([
                'success' => false,
                'message' => 'Invalid data sent by tripay',
            ]);
        }
        dd($data);

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

            // Load the relationships to ensure data is available
            $transaction->load('ticketType');

            $code = strtoupper(uniqid('TKT'));

            $qr = QrCode::format('png')->size(100)->generate($code);
            $qrImageName = 'qr/' . $code . '.png';

            Storage::disk('public')->put($qrImageName, $qr);

            $ticket = Ticket::create([
                'user_id' => $transaction->user_id,
                'event_id' => $transaction->event_id,
                'ticket_type_id' => $transaction->ticket_type_id,
                'detail_pendaftar_id' => $transaction->detail_pendaftar_id,
                'ticket_code' => $code,
                'qr_image' => $qrImageName,
                'transaction_id' => $transaction->id,
                'quantity' => $transaction->quantity,
                'status' => 'unused',
            ]);

            // Decrement quota from the specific ticket type
            if ($transaction->ticketType) {
                $transaction->ticketType->decrement('remaining_quota', $transaction->quantity);
            }

            // Process and store event field responses
            if (!empty($transaction->field_responses)) {
                $responses = json_decode($transaction->field_responses, true);

                if (is_array($responses) && !empty($responses)) {
                    $eventFields = EventField::where('event_id', $transaction->event_id)
                        ->whereIn('name', array_keys($responses))
                        ->get()
                        ->keyBy('name');

                    // 3. Lakukan looping pada array yang sudah di-decode
                    foreach ($responses as $fieldName => $fieldValue) {
                        if (isset($eventFields[$fieldName])) {
                            EventFieldResponse::create([
                                'event_field_id' => $eventFields[$fieldName]->id,
                                'ticket_id' => $ticket->id,
                                'field_name' => $fieldName,
                                'field_value' => $fieldValue,
                            ]);
                        }
                    }
                }
            }

            DB::commit();
        }

        return response()->json(['success' => true]);
    }
}
