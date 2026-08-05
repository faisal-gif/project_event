<?php

namespace App\Http\Controllers;

use App\Exports\AffiliateCommissionExport;
use App\Models\AffiliatePayout;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            $txns = $user->promotedTransactions()
                ->where('status', 'PAID')
                ->where('commission_earned', '>', 0)
                ->with('event:id,title')
                ->get();

            // Riwayat pembayaran komisi milik affiliate ini, dikelompokkan per event.
            $payoutsByEvent = AffiliatePayout::where('promoter_id', $user->id)
                ->whereIn('event_id', $txns->pluck('event_id')->unique())
                ->latest('paid_at')
                ->get()
                ->groupBy('event_id');

            $perEvent = $txns->groupBy('event_id')
                ->map(fn ($group) => [
                    'event' => $group->first()->event?->title ?? 'Event dihapus',
                    'commission' => (float) $group->sum('commission_earned'),
                    'tickets' => (int) $group->sum('quantity'),
                    'count' => $group->count(),
                    'paid' => (float) $group->whereNotNull('payout_id')->sum('commission_earned'),
                    'unpaid' => (float) $group->whereNull('payout_id')->sum('commission_earned'),
                    'payouts' => $payoutsByEvent->get($group->first()->event_id, collect())
                        ->map(fn ($p) => [
                            'amount' => (float) $p->amount,
                            'paid_at' => $p->paid_at,
                            'note' => $p->note,
                            'proof_url' => route('affiliate.payout.proof', $p->id),
                        ])->values(),
                ])
                ->values();

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
    // Pakai Excel::raw + response biasa (bukan BinaryFileResponse) agar tidak
    // memanggil ignore_user_abort() yang di-disable di sebagian server.
    public function reportExport(Request $request)
    {
        $rows = $this->commissionRows($request);
        $filename = 'komisi-affiliate-' . now()->format('Ymd-His') . '.xlsx';

        $content = Excel::raw(new AffiliateCommissionExport($rows), \Maatwebsite\Excel\Excel::XLSX);

        return response($content, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    // Catat pembayaran komisi (manual) untuk 1 affiliate di 1 event.
    // Melunasi SELURUH komisi terutang event tsb (tanpa partial). Admin only.
    public function pay(Request $request, Event $event, User $user)
    {
        $validated = $request->validate([
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $payout = DB::transaction(function () use ($request, $event, $user, $validated) {
            // Lock supaya dua admin tidak dobel-bayar komisi yang sama.
            $txns = Transaction::query()
                ->where('status', 'PAID')
                ->where('event_id', $event->id)
                ->where('promoter_id', $user->id)
                ->where('commission_earned', '>', 0)
                ->whereNull('payout_id')
                ->lockForUpdate()
                ->get();

            if ($txns->isEmpty()) {
                return null;
            }

            // Bukti disimpan di disk 'local' (privat) — bukan folder publik.
            $path = $request->file('proof')->store('affiliate-proofs', 'local');

            $payout = AffiliatePayout::create([
                'promoter_id' => $user->id,
                'event_id' => $event->id,
                'amount' => $txns->sum('commission_earned'),
                'proof_path' => $path,
                'note' => $validated['note'] ?? null,
                'paid_at' => now(),
                'created_by' => Auth::id(),
            ]);

            Transaction::whereIn('id', $txns->pluck('id'))->update(['payout_id' => $payout->id]);

            return $payout;
        });

        if (! $payout) {
            return back()->with('error', 'Tidak ada komisi terutang untuk affiliate ini di event tersebut.');
        }

        return back()->with('success', "Komisi {$user->name} untuk \"{$event->title}\" ditandai lunas.");
    }

    // Tampilkan bukti transfer (disk privat). Hanya admin atau affiliate pemiliknya.
    public function payoutProof(AffiliatePayout $payout)
    {
        $actor = Auth::user();
        abort_unless($actor->role === 'admin' || $payout->promoter_id === $actor->id, 403);
        abort_unless(Storage::disk('local')->exists($payout->proof_path), 404);

        return Storage::disk('local')->response($payout->proof_path);
    }

    // Query agregasi komisi per event + per user (dipakai report & export).
    private function commissionRows(Request $request)
    {
        $user = Auth::user();

        $rows = Transaction::query()
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
            ->with(['event:id,title', 'promoter:id,name,email', 'user:id,name', 'ticketType:id,name,price'])
            ->orderByDesc('paid_at')
            ->get();

        // Riwayat payout untuk pasangan (event, promoter) yang muncul di laporan.
        $payouts = AffiliatePayout::query()
            ->whereIn('event_id', $rows->pluck('event_id')->unique())
            ->whereIn('promoter_id', $rows->pluck('promoter_id')->unique())
            ->with('creator:id,name')
            ->latest('paid_at')
            ->get()
            ->groupBy(fn ($p) => $p->event_id . '-' . $p->promoter_id);

        return $rows
            ->groupBy(fn ($t) => $t->event_id . '-' . $t->promoter_id)
            ->map(fn ($group, $key) => [
                'event' => $group->first()->event?->title ?? 'Event dihapus',
                'event_id' => $group->first()->event_id,
                'promoter_id' => $group->first()->promoter_id,
                'affiliate' => $group->first()->promoter?->name ?? 'User dihapus',
                'affiliate_email' => $group->first()->promoter?->email,
                'tickets' => (int) $group->sum('quantity'),
                'trx_count' => $group->count(),
                'commission' => (float) $group->sum('commission_earned'),
                'paid' => (float) $group->whereNotNull('payout_id')->sum('commission_earned'),
                'unpaid' => (float) $group->whereNull('payout_id')->sum('commission_earned'),
                // Rincian tiap transaksi di dalam grup ini (dipakai drill-down index & export).
                'details' => $group->map(fn ($t) => [
                    'buyer' => $t->user?->name ?? 'Tamu',
                    'ticket_type' => $t->ticketType?->name ?? '-',
                    'price' => (float) ($t->ticketType?->price ?? ($t->quantity ? $t->subtotal / $t->quantity : 0)),
                    'qty' => (int) $t->quantity,
                    'commission_per_ticket' => (float) ($t->quantity ? $t->commission_earned / $t->quantity : $t->commission_earned),
                    'commission' => (float) $t->commission_earned,
                    'is_paid' => $t->payout_id !== null,
                ])->values(),
                'payouts' => $payouts->get($key, collect())->map(fn ($p) => [
                    'amount' => (float) $p->amount,
                    'paid_at' => $p->paid_at,
                    'note' => $p->note,
                    'by' => $p->creator?->name,
                    'proof_url' => route('affiliate.payout.proof', $p->id),
                ])->values(),
            ])
            ->sortByDesc('commission')
            ->values();
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
