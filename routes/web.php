<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TripayCallbackController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Event;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'listEvents' => Event::with('creator')->latest()->take(6)->get(),
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'user'])->prefix('users')->group(function () {
     Route::get('/dashboard', [DashboardController::class, 'user'])->name('user.dashboard');

    Route::get('events', [EventController::class, 'userIndex'])->name('events.user.index');
    Route::get('/events/{event}', [EventController::class, 'userShow'])->name('events.users.show');

    Route::resource('tickets', TicketController::class);
    Route::get('checkout/{event}', [TransactionController::class, 'create'])->name('transactions.checkout');
    Route::get('transactions/', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('transactions/{event}', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions/status', [TransactionController::class, 'status'])->name('transactions.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::resource('events', EventController::class);
    Route::get('/qr/scan', [TicketController::class, 'scan'])->name('ticket.scan');
    Route::post('/qr/validate', [TicketController::class, 'validateQr'])->name('ticket.validate');
});

Route::get('/tickets/used/{code}', [TicketController::class, 'ticket_used'])->name('tickets.used');



Route::get('/event', [HomeController::class, 'event'])->name('events.guest');
Route::get('/event/{event}', [HomeController::class, 'eventShow'])->name('events.guest.detail');

require __DIR__ . '/auth.php';
