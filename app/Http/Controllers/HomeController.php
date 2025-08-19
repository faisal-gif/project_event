<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{

    public function index()
    {
        $events =  Event::where('status', 'valid')->with('creator')->latest()->get();
        $headline = Event::where('status', 'valid')->where('is_headline', 1)->with('creator')->latest()->get();
        $popular = Event::where('status', 'valid')->whereColumn('remainingQuota', '<', 'quota')->with('creator')->latest()->take(3)->get();

        return Inertia::render('Welcome', [
            'listEvents' => $events,
            'headlines' => $headline,
            'populars' => $popular,
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

    public function widget()
    {
        $events = Event::where('status', 'valid')->with('creator')->get();

        return Inertia::render('WidgetHorizontal', [
            'events' => $events,
        ]);
    }
}
