<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TripayCallbackController;

Route::post('/tripay/callback', [TripayCallbackController::class, 'handle']);
