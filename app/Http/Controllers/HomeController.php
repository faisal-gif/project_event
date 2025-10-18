<?php

namespace App\Http\Controllers;

use App\Models\CategoryEvents;
use App\Models\Event;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{

    public function index()
    {
        $events =  Event::where('status', 'valid')->with('creator', 'ticketTypes', 'category')->latest()->get();
        $headline = Event::where('status', 'valid')->where('is_headline', 1)->with('creator', 'ticketTypes', 'category')->latest()->get();
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
        $events = Event::with('creator', 'ticketTypes', 'category')->latest()->get();
        return Inertia::render('EventList', [
            'events' => $events,
        ]);
    }

    public function eventShow(Event $event)
    {
        $event->load('ticketTypes', 'category');

        $plainTextBody = strip_tags($event->description);
        $description = Str::limit($plainTextBody, 155);

        $seoData = [
            'title' => $event->title,
            'description' => $description, // Gunakan deskripsi yang sudah bersih
            'image' => $event->image ? asset('storage/' . $event->image) : null,
            'url' => url()->current(),
        ];


        return Inertia::render('EventDetail', [
            'event' => $event,
            'seo' => $seoData,
        ])->withViewData([
            'ogTitle' => $event->title,
            'ogDescription' => $description,
            'ogImage' => $event->image ? asset('storage/' . $event->image) : null,
            'ogUrl' => url()->current(),
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
