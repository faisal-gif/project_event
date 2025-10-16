<?php

use App\Http\Controllers\CategoryEventsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TripayCallbackController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [HomeController::class, 'index'])->name('welcome');
Route::get('/auth/{provider}', [SocialiteController::class, 'redirect'])->name('auth.provider');
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])->name('auth.callback');
Route::get('/auth/register/complete', [SocialiteController::class, 'showCompleteRegistrationForm'])->name('socialite.register.complete');
Route::post('/auth/register/complete', [SocialiteController::class, 'processCompleteRegistration']);


Route::middleware(['auth', 'user'])->prefix('users')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'user'])->name('user.dashboard');

    Route::get('events', [EventController::class, 'userIndex'])->name('events.user.index');
    Route::get('/events/{event}/{slug}', [EventController::class, 'userShow'])->name('events.users.show');

    Route::resource('tickets', TicketController::class);
    Route::post('tickets/additional/{ticket}', [TicketController::class, 'additonal'])->name('ticket.additional');
    Route::get('checkout/{ticket_type}', [TransactionController::class, 'create'])->name('transactions.checkout');
    Route::get('transactions/', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('transactions/{ticket_type}', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions/status', [TransactionController::class, 'status'])->name('transactions.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    Route::get('/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::resource('events', EventController::class);
    Route::post('events/validate-step', [EventController::class, 'validateStep'])->name('events.validateStep');
    Route::post('events/{event}/validate-step', [EventController::class, 'validateStepEdit'])->name('events.validateStep.edit');
    Route::resource('category', CategoryEventsController::class);
    Route::get('/qr/scan', [TicketController::class, 'scan'])->name('ticket.scan');
    Route::post('/qr/validate', [TicketController::class, 'validateQr'])->name('ticket.validate');
});


Route::get('/tickets/used/{code}', [TicketController::class, 'ticket_used'])->name('tickets.used');


Route::get('/event/lomba', [HomeController::class, 'lomba'])->name('events.lomba');
Route::get('/event/workshop', [HomeController::class, 'workshop'])->name('events.workshop');
Route::get('/event/webinar', [HomeController::class, 'webinar'])->name('events.webinar');
Route::get('/event', [HomeController::class, 'event'])->name('events.guest');
Route::get('/event/{event}/{slug}', [HomeController::class, 'eventShow'])->name('events.guest.detail');

Route::get('/about', function () {
    return Inertia::render('Guest/About');
})->name('about');

Route::get('/partnership', function () {
    return Inertia::render('Guest/Partnership');
})->name('partnership');

Route::get('/faq', function () {
    return Inertia::render('Guest/Faq');
})->name('faq');

Route::get('/contact', function () {
    return Inertia::render('Guest/Contact');
})->name('contact');

Route::get('/privacy-policy', function () {
    return Inertia::render('Guest/PrivacyPolicy');
})->name('privacy-policy');

Route::post('/users/tripay/callback', [TripayCallbackController::class, 'handle']);

require __DIR__ . '/auth.php';
