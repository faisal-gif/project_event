<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TripayCallbackController;

Route::post('/tripay/callback', [TripayCallbackController::class, 'handle']);
Route::get('/horizontal/widget', [HomeController::class, 'widget'])->name('horizontal.widget');
