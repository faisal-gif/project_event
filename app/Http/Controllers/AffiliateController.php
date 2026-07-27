<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AffiliateController extends Controller
{
    /**
     * Halaman affiliate milik user: status pengajuan + kode referral bila sudah disetujui.
     */
    public function me()
    {
        $user = Auth::user();

        return Inertia::render('Affiliate/Me', [
            'affiliate' => [
                'status' => $user->affiliate_status,
                'requested_at' => $user->affiliate_requested_at,
                'reviewed_at' => $user->affiliate_reviewed_at,
                'ref_code' => $user->isApprovedAffiliate() ? $user->id : null,
                'total_commission' => $user->isApprovedAffiliate()
                    ? $user->promotedTransactions()->where('status', 'PAID')->sum('commission_earned')
                    : 0,
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
