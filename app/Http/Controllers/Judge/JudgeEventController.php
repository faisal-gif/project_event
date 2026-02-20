<?php

namespace App\Http\Controllers\Judge;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JudgeEventController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $events = $user->judgedEvents()->with('creator', 'category', 'ticketTypes')->get();
        return Inertia::render('Judge/Event/Index', [
            'events' => $events,
        ]);
    }

    public function penjurian($id)
    {
        $event = Event::find($id);
        $event->load( 'tickets.user', 'tickets.ticket_type', 'tickets.detail_pendaftar', 'tickets.submission.submission_custom_fields', 'tickets.event_field_responses', 'category', 'ticketTypes', 'eventFields', 'eventSubmissionFields');

        return Inertia::render('Judge/Event/Show', ['event' => $event]);
    }
}
