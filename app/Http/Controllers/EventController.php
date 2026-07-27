<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Public event browsing + the shared step-by-step validation endpoint
 * used by both the admin and organizer create/edit wizards.
 * Role-specific CRUD lives in Admin\EventController and Organizer\OrganizerEventController.
 */
class EventController extends Controller
{
    public function userIndex()
    {
        $events = Event::with('creator')->latest()->get();
        return Inertia::render('Users/Events/Index', ['events' => $events]);
    }

    public function userShow(Event $event)
    {
        return Inertia::render('Users/Events/Show', ['event' => $event]);
    }

    public function validateStep(Request $request)
    {
        $step = $request->input('step');
        $rules = [];

        if ($step === 1) {
            $rules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category_id' => 'required|exists:category_events,id',
                'location_type' => 'required|in:online,offline,hybrid',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'status' => 'required|in:valid,expired',
            ];
        } elseif ($step === 2) {
            $rules = [
                'ticket_types' => 'required|array|min:1',
                'ticket_types.*.name' => 'required|string|max:255',
                'ticket_types.*.price' => 'required|numeric|min:0',
                'ticket_types.*.quota' => 'required|integer|min:1',
                'ticket_types.*.purchase_date' => 'nullable|date',
                'ticket_types.*.end_purchase_date' => 'nullable|date|after_or_equal:purchase_date',
                'ticket_types.*.description' => 'required|string',
                'limit_ticket_user' => 'required|integer|min:1',
            ];
        }

        $messages = [
            // Pesan untuk Step 1
            'title.required' => 'Judul event tidak boleh kosong.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'category_id.required' => 'Silakan pilih kategori.',
            'status.required' => 'Silakan pilih status event.',
            'status.in' => 'Pilihan status tidak valid.',
            'start_date.required' => 'Tanggal mulai event wajib diisi',
            'end_date.required' => 'Tanggal berakhir event wajib diisi',
            'end_date.after_or_equal' => 'Tanggal berakhir tidak boleh kurang dari tanggal mulai.',

            // Pesan untuk Step 2
            'ticket_types.min' => 'Anda harus menambahkan minimal 1 jenis tiket.',
            'ticket_types.*.name.required' => 'Nama tiket wajib diisi.',
            'ticket_types.*.price.required' => 'Harga tiket wajib diisi.',
            'ticket_types.*.quota.required' => 'Quota tiket wajib diisi.',
            'ticket_types.*.purchase_date.required' => 'Tanggal awal pembelian tiket wajib diisi.',
            'ticket_types.*.end_purchase_date.required' => 'Tanggal akhir pembelian tiket wajib diisi.',
            'ticket_types.*.description.required' => 'Deskripsi tiket wajib diisi.',
            'ticket_types.*.price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_types.*.quota.min' => 'Kuota tiket minimal adalah 1.',

            'limit_ticket_user.min' => 'Batas tiket per pengguna minimal 1.',
        ];

        $validatedData = $request->validate($rules, $messages);

        return response()->json(['success' => true, 'data' => $validatedData]);
    }

    public function validateStepEdit(Request $request, Event $event)
    {
        // Edit uses the same per-step rules as create.
        return $this->validateStep($request);
    }
}
