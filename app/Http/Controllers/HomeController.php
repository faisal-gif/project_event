<?php

namespace App\Http\Controllers;

use App\Models\CategoryEvents;
use App\Models\Event;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{

    public function index()
    {
        $events =  Event::where('status', 'valid')->with('creator', 'ticketTypes','category')->latest()->get();
        $headline = Event::where('status', 'valid')->where('is_headline', 1)->with('creator', 'ticketTypes','category')->latest()->get();
        $popular = Event::where('status', 'valid')
            ->withSum('ticketTypes as total_quota', 'quota')
            ->withSum('ticketTypes as total_remaining_quota', 'remaining_quota')
            ->havingRaw('total_remaining_quota < total_quota')
            ->with('creator', 'ticketTypes')
            ->latest()
            ->take(3)
            ->get();
        $categories = CategoryEvents::all();

        return Inertia::render('Welcome', [
            'listEvents' => $events,
            'headlines' => $headline,
            'populars' => $popular,
            'categories' => $categories,
        ]);
    }

    public function event()
    {
        $events = Event::with('creator', 'ticketTypes','category')->latest()->get();
        return Inertia::render('EventList', [
            'events' => $events,
        ]);
    }

    public function eventShow(Event $event, TripayService $tripayService)
    {
        $event->load('ticketTypes','category');
        return Inertia::render('EventDetail', [
            'event' => $event,
        ]);
    }

    public function widget()
    {
        $events = Event::where('status', 'valid')->with('creator', 'ticketTypes')->get();

        return Inertia::render('WidgetHorizontal', [
            'events' => $events,
        ]);
    }
}
