<?php

namespace App\Http\Controllers;

use App\Exports\AffiliateCommissionExport;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AffiliateController extends Controller
{
    /**
     * Halaman affiliate milik user: status pengajuan + kode referral bila sudah disetujui.
     */
    public function me()
    {
        $user = Auth::user();
        $approved = $user->isApprovedAffiliate();

        // Komisi yang sudah didapat, dikelompokkan per event.
        $perEvent = collect();
        // Event yang mengaktifkan afiliasi + link referral siap pakai per event.
        $availableEvents = collect();

        if ($approved) {
            $perEvent = $user->promotedTransactions()
                ->where('status', 'PAID')
                ->selectRaw('event_id, SUM(commission_earned) as commission, SUM(quantity) as tickets, COUNT(*) as trx_count')
                ->groupBy('event_id')
                ->with('event:id,title')
                ->get()
                ->map(fn ($row) => [
                    'event' => $row->event?->title ?? 'Event dihapus',
                    'commission' => (float) $row->commission,
                    'tickets' => (int) $row->tickets,
                    'count' => (int) $row->trx_count,
                ]);

            $availableEvents = Event::where('is_affiliate_enabled', true)
                ->select('id', 'slug', 'title', 'affiliate_type', 'affiliate_reward')
                ->latest()
                ->get()
                ->map(fn ($e) => [
                    'title' => $e->title,
                    'type' => $e->affiliate_type,
                    'reward' => (float) $e->affiliate_reward,
                    'link' => route('events.guest.detail', ['event' => $e->id, 'slug' => $e->slug]) . '?ref=' . $user->id,
                ]);
        }

        return Inertia::render('Affiliate/Me', [
            'affiliate' => [
                'status' => $user->affiliate_status,
                'requested_at' => $user->affiliate_requested_at,
                'reviewed_at' => $user->affiliate_reviewed_at,
                'ref_code' => $approved ? $user->id : null,
                'total_commission' => $approved
                    ? $user->promotedTransactions()->where('status', 'PAID')->sum('commission_earned')
                    : 0,
                'per_event' => $perEvent,
                'available_events' => $availableEvents,
            ],
        ]);
    }

    /**
     * User mengajukan diri menjadi affiliate. Sekali ajukan -> status "pending".
     */
    public function apply()
    {
        $user = Auth::user();

        if ($user->affiliate_status === 'approved') {
            return back()->with('info', 'Anda sudah menjadi affiliate.');
        }
        if ($user->affiliate_status === 'pending') {
            return back()->with('info', 'Pengajuan Anda sedang menunggu persetujuan.');
        }

        $user->update([
            'affiliate_status' => 'pending',
            'affiliate_requested_at' => now(),
            'affiliate_reviewed_by' => null,
            'affiliate_reviewed_at' => null,
        ]);

        return back()->with('success', 'Pengajuan affiliate berhasil dikirim. Menunggu persetujuan.');
    }

    /**
     * Daftar pengajuan affiliate (untuk admin & organizer).
     */
    public function index()
    {
        $applications = User::whereNotNull('affiliate_status')
            ->select('id', 'name', 'email', 'affiliate_status', 'affiliate_requested_at', 'affiliate_reviewed_at')
            ->orderByRaw("FIELD(affiliate_status, 'pending', 'approved', 'rejected')")
            ->latest('affiliate_requested_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Affiliate/Applications', ['applications' => $applications]);
    }

    /**
     * Laporan komisi affiliate per event + per user (admin & organizer).
     * Organizer hanya melihat event miliknya.
     */
    public function report(Request $request)
    {
        $rows = $this->commissionRows($request);

        return Inertia::render('Affiliate/Report', [
            'rows' => $rows,
            'total_commission' => $rows->sum('commission'),
            'filters' => ['search' => $request->search ?? '', 'event_id' => $request->event_id ?? ''],
        ]);
    }

    // Export laporan komisi (mengikuti filter yang sama) ke Excel.
    public function reportExport(Request $request)
    {
        $rows = $this->commissionRows($request);

        return Excel::download(new AffiliateCommissionExport($rows), 'komisi-affiliate-' . now()->format('Ymd-His') . '.xlsx');
    }

    // Query agregasi komisi per event + per user (dipakai report & export).
    private function commissionRows(Request $request)
    {
        $user = Auth::user();

        return Transaction::query()
            ->where('status', 'PAID')
            ->whereNotNull('promoter_id')
            ->where('commission_earned', '>', 0)
            ->when($user->role === 'organizer', fn ($q) => $q->whereHas('event', fn ($e) => $e->where('created_by', $user->id)))
            ->when($request->event_id, fn ($q, $id) => $q->where('event_id', $id))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($qq) use ($search) {
                    $qq->whereHas('event', fn ($e) => $e->where('title', 'like', "%{$search}%"))
                        ->orWhereHas('promoter', fn ($p) => $p->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->selectRaw('event_id, promoter_id, SUM(commission_earned) as commission, SUM(quantity) as tickets, COUNT(*) as trx_count')
            ->groupBy('event_id', 'promoter_id')
            ->with(['event:id,title', 'promoter:id,name,email'])
            ->orderByDesc('commission')
            ->get()
            ->map(fn ($row) => [
                'event' => $row->event?->title ?? 'Event dihapus',
                'affiliate' => $row->promoter?->name ?? 'User dihapus',
                'affiliate_email' => $row->promoter?->email,
                'tickets' => (int) $row->tickets,
                'trx_count' => (int) $row->trx_count,
                'commission' => (float) $row->commission,
            ]);
    }

    // Pencarian event (yang punya komisi affiliate) untuk AsyncSelect (JSON, maks 20).
    public function reportEventSearch(Request $request)
    {
        $user = Auth::user();
        $q = $request->q;

        $eventIds = Transaction::query()
            ->where('status', 'PAID')
            ->whereNotNull('promoter_id')
            ->where('commission_earned', '>', 0)
            ->when($user->role === 'organizer', fn ($x) => $x->whereHas('event', fn ($e) => $e->where('created_by', $user->id)))
            ->distinct()
            ->pluck('event_id');

        $events = Event::whereIn('id', $eventIds)
            ->when($q, fn ($query, $q) => $query->where('title', 'like', "%{$q}%"))
            ->limit(20)
            ->get(['id', 'title']);

        return response()->json($events->map(fn ($e) => ['value' => $e->id, 'label' => $e->title]));
    }

    // Pencarian affiliate (promotor) untuk AsyncSelect di halaman komisi (JSON, maks 20).
    public function reportSearch(Request $request)
    {
        $user = Auth::user();
        $q = $request->q;

        // Hanya promotor yang benar-benar punya komisi (scope organizer ke event miliknya).
        $ids = Transaction::query()
            ->where('status', 'PAID')
            ->whereNotNull('promoter_id')
            ->where('commission_earned', '>', 0)
            ->when($user->role === 'organizer', fn ($x) => $x->whereHas('event', fn ($e) => $e->where('created_by', $user->id)))
            ->distinct()
            ->pluck('promoter_id');

        $users = User::whereIn('id', $ids)
            ->when($q, function ($query, $q) {
                $query->where(function ($s) use ($q) {
                    $s->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%");
                });
            })
            ->limit(20)
            ->get(['id', 'name', 'email']);

        return response()->json(
            $users->map(fn ($u) => ['value' => $u->email, 'label' => "{$u->name} — {$u->email}"])
        );
    }

    public function approve(User $user)
    {
        $user->update([
            'affiliate_status' => 'approved',
            'affiliate_reviewed_by' => Auth::id(),
            'affiliate_reviewed_at' => now(),
        ]);

        return back()->with('success', "{$user->name} disetujui sebagai affiliate.");
    }

    public function reject(User $user)
    {
        $user->update([
            'affiliate_status' => 'rejected',
            'affiliate_reviewed_by' => Auth::id(),
            'affiliate_reviewed_at' => now(),
        ]);

        return back()->with('success', "Pengajuan affiliate {$user->name} ditolak.");
    }
}
