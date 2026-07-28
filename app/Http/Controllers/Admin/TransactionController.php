<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    // Pencarian transaksi ringan untuk react-select AsyncSelect (JSON, maks 20).
    public function search(Request $request)
    {
        $q = $request->q;

        $trx = Transaction::with(['user:id,name', 'event:id,title'])
            ->when($q, function ($query, $q) {
                $query->where(function ($s) use ($q) {
                    $s->where('reference', 'like', "%{$q}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%"))
                        ->orWhereHas('event', fn ($e) => $e->where('title', 'like', "%{$q}%"));
                });
            })
            ->latest()
            ->limit(20)
            ->get();

        // value = reference (unik) agar tabel bisa difilter lewat param search.
        return response()->json(
            $trx->map(fn ($t) => [
                'value' => $t->reference,
                'label' => "{$t->reference} — " . ($t->user?->name ?? '-') . ' — ' . ($t->event?->title ?? '-'),
            ])
        );
    }

    // Pencarian event untuk AsyncSelect (JSON, maks 20).
    public function eventSearch(Request $request)
    {
        $q = $request->q;

        $events = Event::query()
            ->when($q, fn ($query, $q) => $query->where('title', 'like', "%{$q}%"))
            ->latest()
            ->limit(20)
            ->get(['id', 'title']);

        return response()->json($events->map(fn ($e) => ['value' => $e->id, 'label' => $e->title]));
    }

    public function index(Request $request)
    {
        $transactions = Transaction::with(['event', 'user'])
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->event_id, fn ($query, $id) => $query->where('event_id', $id))
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                        ->orWhereHas('event', fn ($e) => $e->where('title', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Transaction/Index', [
            'transactions' => $transactions,
            'filters' => [
                'status' => $request->status ?? '',
                'search' => $request->search ?? '',
                'event_id' => $request->event_id ?? '',
            ],
        ]);
    }
}
