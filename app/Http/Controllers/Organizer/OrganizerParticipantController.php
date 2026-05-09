<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizerParticipantController extends Controller
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
            'submission.submission_custom_fields'
        ]);

        return Inertia::render('Organizer/Participants/Show', [
            'ticket' => $ticket
        ]);
    }
}
