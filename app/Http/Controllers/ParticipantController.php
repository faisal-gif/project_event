<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function show($id)
    {
        $ticket = Ticket::find($id);
        // Load semua relasi yang berhubungan dengan peserta ini
        $ticket->load([
            'user',
            'ticket_type',
            'event', // Untuk link kembali ke event
            'detail_pendaftar',
            'event_field_responses',
            'submission.submission_custom_fields',
            'transaction.promoter:id,name,email',
        ]);

        return Inertia::render('Admin/Participants/Show', [
            'ticket' => $ticket
        ]);
    }
}
