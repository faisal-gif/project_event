<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EventController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function Index()
    {
        $events = Event::with('creator')->latest()->get();
        return Inertia::render('Admin/Events/Index', ['events' => $events]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'image' => 'required|image',
            'title' => 'required',
            'description' => 'required',
            'type' => 'required|in:event,competition',
            'category' => 'required',
            'type' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'lokasi' => 'required',
        ]);

        $slug = Str::slug($request->title);

        $path = $request->file('image')->store('images', 'public');

        Event::create([
            'slug' => $slug,
            'image' => $path,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'category' => $request->category,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'price' => $request->price,
            'quota' => $request->quota,
            'remainingQuota' => $request->quota,
            'location' => $request->lokasi,
            'created_by' => auth()->user()->id,
            'is_published' => '1',

        ]);
        return redirect()->route('events.index')->with('success', 'Event created');
    }

    /**
     * Display the specified resource.
     */
    public function Show(Event $event)
    {
        $event = Event::with('tickets')->findOrFail($event->id);

        return Inertia::render('Admin/Events/Show', ['event' => $event]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return Inertia::render('Admin/Events/Edit', ['event' => $event]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'image' => 'nullable|image',
            'title' => 'required',
            'description' => 'required',
            'type' => 'required|in:event,competition',
            'category' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'lokasi' => 'required',
        ]);

        // Update image jika ada file baru
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $event->image = $path;
        }

        $event->update([
            'slug' => Str::slug($request->title),
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'category' => $request->category,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'price' => $request->price,
            'quota' => $request->quota,
            'remainingQuota' => $request->quota,
            'location' => $request->lokasi,
        ]);

        $event->save();

        return redirect()->route('events.index')->with('success', 'Event updated');
    }

    /**
     * Display the specified resource.
     */
    public function userIndex()
    {
        $events = Event::with('creator')->latest()->get();
        return Inertia::render('Users/Events/Index', ['events' => $events]);
    }

    /**
     * Display the specified resource.
     */
    public function userShow(Event $event)
    {
        return Inertia::render('Users/Events/Show', ['event' => $event]);
    }
}
