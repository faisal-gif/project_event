<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user(){
        return Inertia::render('Users/Dashboard');
    }

    public function admin(){
        return Inertia::render('Admin/Dashboard');
    }

}
