<?php

namespace App\Http\Controllers\Judge;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JudgeDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $event_count = $user->judgedEvents()->count();
        return Inertia::render('Judge/Dashboard', [
            'events_count' =>  $event_count
        ]);
    }
}
