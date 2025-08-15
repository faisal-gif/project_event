<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    
    public function index(){
        $events =  Event::with('creator')->latest()->take(3)->get();
        $lomba = Event::where('type', 'competition')->with('creator')->latest()->take(3)->get();
        $event = Event::where('type', 'event')->with('creator')->latest()->take(3)->get();

        return Inertia::render('Welcome', [
            'listEvents' => $events,
            'lomba' => $lomba,
            'event' => $event,
        ]);

    }

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
