<?php

namespace App\Http\Controllers\Organizer;

use App\Exports\ParticipantsExport;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel; 

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

    public function exportExcel(Event $event)
    {
        $fileName = 'Peserta_' . $event->slug . '_' . date('Y-md') . '.xlsx';
        
        return Excel::download(new ParticipantsExport($event->id), $fileName);
    }
}
