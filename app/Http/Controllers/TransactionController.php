<?php

namespace App\Http\Controllers;

use App\Models\DetailPendaftar;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->user()->id;
        $transactions = Transaction::with('event')->where('user_id', $userId)->latest()->get();
        return Inertia::render('Users/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Event $event, TripayService $tripay)
    {
        $channel = $tripay->getPaymentChannel();

        return Inertia::render('Users/Transaction/Create', [
            'event' => $event,
            'channel' => $channel,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Event $event, TripayService $tripay)
    {
        $validated = $request->validate([
            'quantity' => 'required',
            'paymentMethod' => 'required',
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'usia' => 'required',
            'pekerjaan' => 'required',
            'terms' => 'accepted',
        ]);

        $user = auth()->user();
        $result = $tripay->createTransaction($event, $user, $validated);

        if (isset($result['success']) && $result['success']) {

            $detailPendaftar = DetailPendaftar::create([
                'nama' => $validated['name'],
                'email' => $validated['email'],
                'no_hp' => $validated['phone'],
                'usia' => $validated['usia'],
                'pekerjaan' => $validated['pekerjaan'],
            ]);

            $trx = Transaction::create([
                'user_id'       => $user->id,
                'event_id'     => $event->id,
                'detail_pendaftar_id' => $detailPendaftar->id,
                'reference'     => $result['data']['reference'],
                'payment_method' => $result['data']['payment_method'],
                'amount'        => $event->price,
                'quantity'      => $validated['quantity'],
                'subtotal'      => $result['data']['amount'],
                'tripay_fee'    => $result['data']['total_fee'],
                'status'        => $result['data']['status'],
                'checkout_url'  => $result['data']['checkout_url'],
            ]);


            return redirect()->route('transactions.status', ['tripay_reference' => $trx->reference])->with('checkout_url', $trx->checkout_url);
        }

        return back()->with('error', 'Gagal membuat transaksi: ' . ($result['message'] ?? 'Tidak diketahui'));
    }

    public function status(Request $request)
    {
        $trx = Transaction::where('reference', $request->tripay_reference)->first();
        if (!$trx) {
            return back()->with('error', 'Transaksi tidak ditemukan');
        }

        $ticket = Ticket::where('transaction_id', $trx->id)->first();

        return Inertia::render('Users/Transaction/Status', [
            'trx' => $trx,
            'event' => $trx->event,
            'ticket' => $ticket,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
