<?php

use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\AffiliateController;
use App\Http\Controllers\CategoryEventsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Judge\JudgeDashboardController;
use App\Http\Controllers\Judge\JudgeEventController;
use App\Http\Controllers\Organizer\OrganizerDashboardController;
use App\Http\Controllers\Organizer\OrganizerEventController;
use App\Http\Controllers\Organizer\OrganizerParticipantController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TripayCallbackController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoucherController;
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
    Route::post('voucher/validate', [TransactionController::class, 'validateVoucher'])->name('voucher.validate');
    Route::get('checkout/{ticket_type}', [TransactionController::class, 'create'])->name('transactions.checkout');
    Route::get('transactions/', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('transactions/{ticket_type}', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions/status', [TransactionController::class, 'status'])->name('transactions.status');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Affiliate (sisi user): halaman status + pengajuan
    Route::get('/affiliate', [AffiliateController::class, 'me'])->name('affiliate.me');
    Route::post('/affiliate/apply', [AffiliateController::class, 'apply'])->name('affiliate.apply');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified']);

    Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');
    Route::resource('events', AdminEventController::class);
    Route::get('events/participant/{id}', [ParticipantController::class, 'show'])->name('participant.show');
    Route::post('events/validate-step', [EventController::class, 'validateStep'])->name('events.validateStep');
    Route::post('events/{event}/validate-step', [EventController::class, 'validateStepEdit'])->name('events.validateStep.edit');

    // Kelola pengajuan affiliate + laporan komisi
    Route::get('affiliates', [AffiliateController::class, 'index'])->name('affiliates.index');
    Route::get('affiliates/report', [AffiliateController::class, 'report'])->name('affiliates.report');
    Route::get('affiliates/report/export', [AffiliateController::class, 'reportExport'])->name('affiliates.report.export');
    Route::get('affiliates/report/search', [AffiliateController::class, 'reportSearch'])->name('affiliates.report.search');
    Route::get('affiliates/report/event-search', [AffiliateController::class, 'reportEventSearch'])->name('affiliates.report.eventSearch');
    Route::patch('affiliates/{user}/approve', [AffiliateController::class, 'approve'])->name('affiliates.approve');
    Route::patch('affiliates/{user}/reject', [AffiliateController::class, 'reject'])->name('affiliates.reject');

    Route::get('transactions/search', [TransactionController::class, 'adminSearch'])->name('transactions.search');
    Route::get('transactions/event-search', [TransactionController::class, 'adminEventSearch'])->name('transactions.eventSearch');

    // Voucher (admin)
    Route::get('vouchers', [VoucherController::class, 'index'])->name('vouchers.index');
    Route::post('vouchers', [VoucherController::class, 'store'])->name('vouchers.store');
    Route::put('vouchers/{voucher}', [VoucherController::class, 'update'])->name('vouchers.update');
    Route::delete('vouchers/{voucher}', [VoucherController::class, 'destroy'])->name('vouchers.destroy');

    Route::resource('category', CategoryEventsController::class);
    Route::get('users/search', [UserController::class, 'search'])->name('users.search');
    Route::resource('users', UserController::class);
    Route::get('/qr/scan', [TicketController::class, 'scan'])->name('ticket.scan');
    Route::get('/qr/validate', [TicketController::class, 'validateQr'])->name('ticket.validate');
    Route::get('transactions', [TransactionController::class, 'adminIndex'])->name('transactions.index');
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


Route::middleware(['auth', 'organizer'])->prefix('organizer')->name('organizer.')->group(function () {
    Route::get('/dashboard', [OrganizerDashboardController::class, 'index'])->name('dashboard');
    Route::resource('events', OrganizerEventController::class);
    Route::get('events/participant/{id}', [OrganizerParticipantController::class, 'show'])->name('participant.show');
    Route::post('events/validate-step', [EventController::class, 'validateStep'])->name('events.validateStep');
    Route::post('events/{event}/validate-step', [EventController::class, 'validateStepEdit'])->name('events.validateStep.edit');

    // Laporan komisi affiliate (approval/pengajuan hanya admin)
    Route::get('affiliates/report', [AffiliateController::class, 'report'])->name('affiliates.report');
    Route::get('affiliates/report/export', [AffiliateController::class, 'reportExport'])->name('affiliates.report.export');
    Route::get('affiliates/report/search', [AffiliateController::class, 'reportSearch'])->name('affiliates.report.search');
    Route::get('affiliates/report/event-search', [AffiliateController::class, 'reportEventSearch'])->name('affiliates.report.eventSearch');

    Route::get('/qr/scan', [TicketController::class, 'scan'])->name('ticket.scan');
    Route::get('/qr/validate', [TicketController::class, 'validateQr'])->name('ticket.validate');
    Route::get('/events/{event}/export-participants', [OrganizerParticipantController::class, 'exportExcel'])->name('events.export');
    Route::patch('/events/{event}/participants/{ticket}/status', [OrganizerParticipantController::class, 'updateStatus'])->name('events.participants.update-status');
});

Route::middleware(['auth', 'judge'])->prefix('judge')->name('judge.')->group(function () {
    Route::get('/', [JudgeDashboardController::class, 'index'])->name('dashboard');
    Route::get('/events', [JudgeEventController::class, 'index'])->name('events.index');
    Route::get('/events/penjurian/{id}', [JudgeEventController::class, 'penjurian'])->name('event.penjurian');
});

require __DIR__ . '/auth.php';
