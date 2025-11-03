<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Submission;
use App\Models\SubmissionCustomFields;
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
        $ticket->load(['event.eventSubmissionFields', 'transaction.ticketType', 'user']);

        return Inertia::render('Users/Tickets/Show', [
            'ticket' => $ticket
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

    public function additonal(Request $request, Ticket $ticket)
    {

        $event = $ticket->event->load('eventSubmissionFields');
        $user = auth()->user();

        $fieldRules = [];
        if ($event->needs_submission) {
            foreach ($event->eventSubmissionFields as $field) {
                $rules = $field->is_required ? ['required'] : ['nullable'];
                $fieldRules[$field->name] = $rules;
            }
        }

        $validated = $request->validate(array_merge($fieldRules));

        $submision = Submission::create([
            'event_id' => $event->id,
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'status' => 'reviewed',
        ]);

        foreach ($validated  as $fieldName => $fieldValue) {
            if (isset($submision)) {
                SubmissionCustomFields::create([
                    'submission_id' => $submision->id,
                    'field_name' => $fieldName,
                    'field_value' => $fieldValue,
                ]);
            }
        }



        $ticket->status = 'used';
        $ticket->save();

        return redirect()->back();
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
        return redirect()->back();
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
