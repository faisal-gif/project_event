<?php

namespace App\Services;

use App\Models\EventField;
use App\Models\EventFieldResponse;
use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketService
{
    /**
     * Create a new class instance.
     */

    public function issueTicket(Transaction $transaction)
    {
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

        return response()->json(['success' => true]);
    }
}
