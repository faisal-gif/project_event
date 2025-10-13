<?php

namespace App\Http\Controllers;

use App\Models\DetailPendaftar;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
        $channel = $tripay->getPaymentChannel();

        return Inertia::render('Users/Transaction/Create', [
            'ticketType' => $ticketType,
            'event' => $ticketType->event,
            'channel' => $channel,
            'quantity' => $validated['quantity'],
        ]);
    }

    public function store(Request $request, TicketType $ticketType, TripayService $tripay)
    {
        $event = $ticketType->event->load('eventFields');

        $mainRules = [
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $event->limit_ticket_user],
            'paymentMethod' => 'required',
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
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
        $result = $tripay->createTransaction($ticketType, $user, $validated);

        dd($result);

        if (isset($result['success']) && $result['success']) {

            $detailPendaftar = DetailPendaftar::create([
                'nama' => $validated['name'],
                'email' => $validated['email'],
                'no_hp' => $validated['phone'],
            ]);

          
            $trx = Transaction::create([
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
                'field_responses' => json_encode($validated['field_responses'] ?? []), // Store field responses as JSON
            ]);



            return redirect()->route('transactions.status', ['tripay_reference' => $trx->reference])->with('checkout_url', $trx->checkout_url);
        }

        return back()->with('error', 'Failed to create transaction: ' . ($result['message'] ?? 'Unknown error'));
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

    // ... other methods
}
