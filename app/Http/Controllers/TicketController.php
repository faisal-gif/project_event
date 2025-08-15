<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->user()->id;
        $tickets = Ticket::with(['event', 'transaction'])->where('user_id', $userId)->latest()->get();

        return Inertia::render('Users/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {

        return Inertia::render('Users/Tickets/Show', [
            'ticket' => $ticket::with(['event', 'transaction', 'user'])->find($ticket->id)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    public function used($ticket)
    {
        $ticket = Ticket::where('ticket_code', $ticket)->first();
        $ticket->status = 'used';
        $ticket->save();
        return redirect()->route('tickets.index');
    }

    public function scan()
    {
        return Inertia::render('Admin/QrScanner/Index');
    }

    public function validateQr(Request $request)
    {
        $qrData = $request->qr_data;

        // Contoh: cari berdasarkan data dari QR
        $order = Ticket::where('ticket_code', $qrData)->first();
        if (!$order) {
            throw ValidationException::withMessages([
                'message' => 'QR tidak valid atau tidak ditemukan.'
            ]);
        }

        if ($order->status === 'used') {
            throw ValidationException::withMessages([
                'message' => 'Tiket sudah digunakan.'
            ]);
        }

        if ($order->event->status === 'expired') {
            throw ValidationException::withMessages([
                'message' => 'Tiket tidak tersedia.'
            ]);
        }

        $order->status = 'used';
        $order->save();

        // Tambahkan logika validasi tiket, cek status, dll

        return back()->with('success', 'Tiket valid: ' . $order->ticket_code);
    }
}
