<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;

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
            'limit' => 'required|integer',
            'headline' => 'required|boolean',
        ]);

        $slug = Str::slug($request->title);

        $manager = new ImageManager(new Driver());
        $image = $manager->read($request->file('image'));
        $encode = $image->toWebp();
        Storage::disk('public')->put('images/' . $slug . '.webp', $encode);

        Event::create([
            'slug' => $slug,
            'image' => 'images/' . $slug . '.webp',
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
            'status' => 'valid',
            'is_headline' => $request->headline,
            'limit_ticket_user' => $request->limit,
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
            'limit' => 'required|integer',
            'headline' => 'required|boolean',
        ]);

        $slug = Str::slug($request->title);

        // Update image jika ada file baru
        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($event->image);
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encode = $image->toWebp();
            Storage::disk('public')->put('images/' . $slug . '.webp', $encode);

            $event->image = 'images/' . $slug . '.webp';
        }

        $event->update([
            'slug' => $slug,
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
            'is_headline' => $request->headline,
            'limit_ticket_user' => $request->limit,
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
