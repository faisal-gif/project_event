<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function event()
    {

        $events = Event::with('creator')->latest()->get();
        return Inertia::render('EventList', [
            'events' => $events,
        ]);
    }

    public function eventShow(Event $event, TripayService $tripayService)
    {
        return Inertia::render('EventDetail', [
            'event' => $event,
        ]);
    }
}
