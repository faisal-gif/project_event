<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function admin(){
        $paid = Transaction::where('status', 'PAID');

        // KPI
        $totalRevenue = (float) (clone $paid)->sum('subtotal');
        $revenueThisMonth = (float) Transaction::where('status', 'PAID')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('subtotal');
        $ticketsSold = (int) (clone $paid)->sum('quantity');

        // Rincian status transaksi
        $trxByStatus = Transaction::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')->pluck('total', 'status');
        $trxTotal = (int) $trxByStatus->sum();

        // Rincian event & user
        $eventsValid = Event::where('status', 'valid')->count();
        $eventsExpired = Event::where('status', 'expired')->count();
        $eventsUpcoming = Event::where('start_date', '>', now())->count();
        $usersByRole = User::selectRaw('role, COUNT(*) as total')
            ->groupBy('role')->pluck('total', 'role');

        // Transaksi terbaru
        $recentTransactions = Transaction::with(['user:id,name', 'event:id,title'])
            ->latest()
            ->take(6)
            ->get(['id', 'reference', 'quantity', 'subtotal', 'status', 'created_at', 'user_id', 'event_id'])
            ->map(fn ($t) => [
                'reference' => $t->reference,
                'user' => $t->user?->name ?? '-',
                'event' => $t->event?->title ?? '-',
                'quantity' => $t->quantity,
                'subtotal' => (float) $t->subtotal,
                'status' => $t->status,
                'date' => $t->created_at,
            ]);

        // Top event berdasarkan tiket terjual
        $topEvents = Transaction::where('status', 'PAID')
            ->selectRaw('event_id, SUM(quantity) as tickets, SUM(subtotal) as revenue')
            ->groupBy('event_id')
            ->with('event:id,title')
            ->orderByDesc('tickets')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'event' => $r->event?->title ?? '-',
                'tickets' => (int) $r->tickets,
                'revenue' => (float) $r->revenue,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'revenue_this_month' => $revenueThisMonth,
                'tickets_sold' => $ticketsSold,
                'users_count' => User::count(),
                'events_count' => Event::count(),
            ],
            'transactions' => [
                'total' => $trxTotal,
                'paid' => (int) ($trxByStatus['PAID'] ?? 0),
                'unpaid' => (int) ($trxByStatus['UNPAID'] ?? 0),
                'expired' => (int) ($trxByStatus['EXPIRED'] ?? 0),
            ],
            'events' => [
                'valid' => $eventsValid,
                'expired' => $eventsExpired,
                'upcoming' => $eventsUpcoming,
            ],
            'users_by_role' => $usersByRole,
            'recent_transactions' => $recentTransactions,
            'top_events' => $topEvents,
        ]);
    }

}
