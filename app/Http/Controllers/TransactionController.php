<?php

namespace App\Http\Controllers;

use App\Models\DetailPendaftar;
use App\Models\Event;
use App\Models\EventField;
use App\Models\EventFieldResponse;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Services\TicketService;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->id;
        $transactions = Transaction::with('event')->where('user_id', $userId)->latest()->get();
        return Inertia::render('Users/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function create(Request $request, TicketType $ticketType, TripayService $tripay)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $ticketType->event->limit_ticket_user],
        ]);

        if ($ticketType->remaining_quota < $validated['quantity']) {
            return back()->with('error', 'Sorry, the remaining tickets are not enough.');
        }

        $ticketType->load('event.eventFields'); // Load event fields
        $channel = $ticketType->price > 0 ? $tripay->getPaymentChannel() : [];


        return Inertia::render('Users/Transaction/Create', [
            'ticketType' => $ticketType,
            'event' => $ticketType->event,
            'channel' => $channel,
            'quantity' => $validated['quantity'],
        ]);
    }

    public function store(Request $request, TicketType $ticketType, TripayService $tripay, TicketService $ticketServices)
    {
        $event = $ticketType->event->load('eventFields');

        $mainRules = [
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $event->limit_ticket_user],
            'paymentMethod' => $ticketType->price > 0 ? 'required' : 'nullable',
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'usia' => 'required|integer|min:0',
            'pekerjaan' => 'required|string|max:255',
            'terms' => 'accepted',
        ];

        $fieldRules = [];
        if ($event->need_additional_questions) {
            foreach ($event->eventFields as $field) {
                $rules = $field->is_required ? ['required'] : ['nullable'];
                $fieldRules['field_responses.' . $field->name] = $rules;
            }
        }

        $validated = $request->validate(array_merge($mainRules, $fieldRules));

        if ($ticketType->remaining_quota < $validated['quantity']) {
            return back()->with('error', 'Sorry, the remaining tickets are not enough.');
        }

        $user = auth()->user();

        try {
            $trx = DB::transaction(function () use ($ticketType, $user, $validated, $tripay, $ticketServices) {
                $detailPendaftar = DetailPendaftar::create([
                    'nama' => $validated['name'],
                    'email' => $validated['email'],
                    'no_hp' => $validated['phone'],
                    'usia' => $validated['usia'],
                    'pekerjaan' => $validated['pekerjaan'],
                    'terms_and_condition' => $validated['terms'],
                ]);

                if ($ticketType->price == 0) {
                    // Gratis
                    $transaction = Transaction::create([
                        'user_id'       => $user->id,
                        'event_id'     => $ticketType->event->id,
                        'ticket_type_id' => $ticketType->id,
                        'detail_pendaftar_id' => $detailPendaftar->id,
                        'reference'     => 'TICKET-' . Str::random(6) . '-' . time(),
                        'payment_method' => 'FREE',
                        'amount'        => 0,
                        'quantity'      => $validated['quantity'],
                        'subtotal'      => 0,
                        'tripay_fee'    => 0,
                        'status'        => 'PAID',
                        'checkout_url'  => null,
                        'field_responses' => json_encode($validated['field_responses'] ?? []),
                    ]);

                    $ticketServices->issueTicket($transaction);
                } else {
                    // Berbayar
                    $result = $tripay->createTransaction($ticketType, $user, $validated);

                    if (!isset($result['success']) || !$result['success']) {
                        throw new \Exception('Failed to create transaction: ' . ($result['message'] ?? 'Unknown error'));
                    }

                    $transaction = Transaction::create([
                        'user_id'       => $user->id,
                        'event_id'     => $ticketType->event->id,
                        'ticket_type_id' => $ticketType->id,
                        'detail_pendaftar_id' => $detailPendaftar->id,
                        'reference'     => $result['data']['reference'],
                        'payment_method' => $result['data']['payment_method'],
                        'amount'        => $ticketType->price,
                        'quantity'      => $validated['quantity'],
                        'subtotal'      => $result['data']['amount'],
                        'tripay_fee'    => $result['data']['total_fee'],
                        'status'        => $result['data']['status'],
                        'checkout_url'  => $result['data']['checkout_url'],
                        'field_responses' => json_encode($validated['field_responses'] ?? []),
                    ]);
                }
                return $transaction;
            });
            return redirect()->route('transactions.status', ['tripay_reference' => $trx->reference])->with('checkout_url', $trx->checkout_url);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function status(Request $request)
    {
        $trx = Transaction::where('reference', $request->tripay_reference)->firstOrFail();
        $trx->load('event', 'ticketType');

        $ticket = Ticket::where('transaction_id', $trx->id)->first();

        return Inertia::render('Users/Transaction/Status', [
            'trx' => $trx,
            'event' => $trx->event,
            'ticket' => $ticket,
        ]);
    }


    public function adminIndex()
    {
        $transactions = Transaction::with(['event', 'user'])->latest()->get();
        return Inertia::render('Admin/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }
}
