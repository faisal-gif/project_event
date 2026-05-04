<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::with('event:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $events = Event::select('id', 'title')->get();

        return Inertia::render('Admin/Voucher/Index', [
            'vouchers' => $vouchers,
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'code' => 'required|string|unique:vouchers,code|max:20',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|integer|min:1',
            'max_discount' => 'nullable|integer|min:0',
            'quota' => 'required|integer|min:1',
            'valid_until' => 'nullable|date',
        ]);

        Voucher::create([
            'event_id' => $request->event_id,
            'code' => strtoupper(Str::slug($request->code, '')), // Memastikan kode huruf besar tanpa spasi
            'type' => $request->type,
            'value' => $request->value,
            'max_discount' => $request->max_discount,
            'quota' => $request->quota,
            'valid_until' => $request->valid_until,
        ]);

        return redirect()->back()->with('success', 'Voucher berhasil dibuat.');
    }

    public function update(Request $request, Voucher $voucher)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'code' => 'required|string|max:20|unique:vouchers,code,' . $voucher->id,
            'type' => 'required|in:fixed,percent',
            'value' => 'required|integer|min:1',
            'max_discount' => 'nullable|integer|min:0',
            'quota' => 'required|integer|min:0',
            'valid_until' => 'nullable|date',
        ]);

        $voucher->update([
            'event_id' => $request->event_id,
            'code' => strtoupper(Str::slug($request->code, '')),
            'type' => $request->type,
            'value' => $request->value,
            'max_discount' => $request->max_discount,
            'quota' => $request->quota,
            'valid_until' => $request->valid_until,
        ]);

        return redirect()->back()->with('success', 'Voucher berhasil diperbarui.');
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return redirect()->back()->with('success', 'Voucher berhasil dihapus.');
    }
}
