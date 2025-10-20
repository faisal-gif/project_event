<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user(){
        $user = Auth::user();
        $tickets_count = Ticket::where('user_id', $user->id)->count();
        $transactions_count = Transaction::where('user_id', $user->id)->count();

        $participated_events = Event::whereHas('tickets', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with('category')->get();

        $participated_event_categories = $participated_events->pluck('category_id')->unique();

        $recommended_events = Event::whereIn('category_id', $participated_event_categories)
            ->whereNotIn('id', $participated_events->pluck('id'))
            ->with('category')
            ->take(5)
            ->get();

        return Inertia::render('Users/Dashboard', [
            'tickets_count' => $tickets_count,
            'transactions_count' => $transactions_count,
            'participated_events' => $participated_events,
            'recommended_events' => $recommended_events,
        ]);
    }

    public function admin(){
        $users_count = User::count();
        $events_count = Event::count();
        $tickets_count = Ticket::count();
        $transactions_count = Transaction::count();

        return Inertia::render('Admin/Dashboard', [
            'users_count' => $users_count,
            'events_count' => $events_count,
            'tickets_count' => $tickets_count,
            'transactions_count' => $transactions_count,
        ]);
    }

}
