<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use App\Models\Transaction;
use Inertia\Inertia;

class OrganizerDashboardController extends Controller
{
    public function index()
    {
        $organizerId = auth()->id();

        // Total events created by the organizer
        $totalEvents = Event::where('created_by', $organizerId)->count();

        // Get all event IDs for the organizer
        $eventIds = Event::where('created_by', $organizerId)->pluck('id');

        // Total revenue from successful transactions for the organizer's events
        $totalRevenue = Transaction::whereIn('event_id', $eventIds)
            ->where('status', 'paid')
            ->sum('subtotal');

        // Total tickets sold for the organizer's events
        $ticketsSold = Transaction::whereIn('event_id', $eventIds)
            ->where('status', 'paid')
            ->sum('quantity');

        // Recent 5 events
        $recentEvents = Event::where('created_by', $organizerId)
            ->with('category')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Organizer/Dashboard/Index', [
            'totalEvents' => $totalEvents,
            'totalRevenue' => $totalRevenue,
            'ticketsSold' => $ticketsSold,
            'recentEvents' => $recentEvents,
        ]);
    }
}
