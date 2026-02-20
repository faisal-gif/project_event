<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Submission;
use App\Models\SubmissionCustomFields;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->user()->id;
        $tickets = Ticket::with(['event', 'transaction'])->where('user_id', $userId)->latest()->get();

        return Inertia::render('Users/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $ticket->load(['event.eventSubmissionFields', 'transaction.ticketType', 'user']);

        return Inertia::render('Users/Tickets/Show', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    public function additonal(Request $request, Ticket $ticket)
    {
        // Pastikan relation ter-load
        $event = $ticket->event->load('eventSubmissionFields');
        $user = auth()->user();

        $fieldRules = [];
        $customMessages = [];

        // 1. Bangun Rules dan Messages
        if ($event->needs_submission) {
            foreach ($event->eventSubmissionFields as $field) {
                $rules = $field->is_required ? ['required'] : ['nullable'];

                if ($field->type === 'image') {
                    $rules[] = 'image';
                    $rules[] = 'max:2048';
                } elseif ($field->type === 'file') {
                    $rules[] = 'file';
                    $rules[] = 'max:5120';
                }

                $fieldRules[$field->name] = $rules;

                if ($field->is_required) {
                    $customMessages["{$field->name}.required"] = "Bagian {$field->label} wajib diisi.";
                }
                $customMessages["{$field->name}.image"] = "{$field->label} harus berupa gambar.";
                $customMessages["{$field->name}.max"] = "Ukuran {$field->label} terlalu besar.";
            }
        }

        // 2. Validasi
        $validated = $request->validate($fieldRules, $customMessages);

        try {
            $trx = DB::transaction(function () use ($event, $ticket, $user, $validated, $request) {
                // 3. Buat Parent Submission
                $submission = Submission::create([
                    'event_id' => $event->id,
                    'ticket_id' => $ticket->id,
                    'user_id' => $user->id,
                    'status' => 'reviewed',
                ]);

                // --- [MODIFIKASI] ---
                // Buat Map agar mudah mengambil ID berdasarkan nama field
                // Hasilnya array/collection dengan key 'nama_field' dan value object field itu sendiri
                $fieldMap = $event->eventSubmissionFields->keyBy('name');

                // 4. Proses Simpan Data
                foreach ($validated as $fieldName => $fieldValue) {
                    $finalValue = $fieldValue;

                    // Cek file
                    if ($request->hasFile($fieldName)) {
                        $file = $request->file($fieldName);
                        // Simpan file
                        $path = $file->store("uploads/submissions/{$event->slug}/{$fieldName}", 'public');
                        // Simpan full path agar mudah diakses frontend
                        $finalValue = $path;
                    }

                    // Ambil ID dari map yang sudah dibuat di atas
                    $fieldId = $fieldMap[$fieldName]->id ?? null;
                    // Opsional: Ambil tipe juga jika perlu disimpan di tabel custom fields
                    $fieldType = $fieldMap[$fieldName]->type ?? 'text';

                    // Simpan ke tabel relasional
                    SubmissionCustomFields::create([
                        'submission_id' => $submission->id,
                        'submission_field_id' => $fieldId, 
                        'field_name' => $fieldName,
                        'field_type' => $fieldType, // (Opsional) Disarankan simpan tipe juga agar Frontend mudah render
                        'field_value' => $finalValue,
                    ]);
                }

                // 5. Update Status Tiket
                $ticket->update(['status' => 'used']);

                return $submission;
            });

            return redirect()->back()->with('success', 'Data karya berhasil dikirim.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    public function used($ticket)
    {
        $ticket = Ticket::where('ticket_code', $ticket)->first();
        $ticket->status = 'used';
        $ticket->save();
        return redirect()->back();
    }

    public function scan()
    {
        return Inertia::render('Admin/QrScanner/Index');
    }

    public function validateQr(Request $request)
    {
        $qrData = $request->qr_data;

        // Contoh: cari berdasarkan data dari QR
        $order = Ticket::where('ticket_code', $qrData)->first();
        if (!$order) {
            throw ValidationException::withMessages([
                'message' => 'QR tidak valid atau tidak ditemukan.'
            ]);
        }

        if ($order->status === 'used') {
            throw ValidationException::withMessages([
                'message' => 'Tiket sudah digunakan.'
            ]);
        }

        if ($order->event->status === 'expired') {
            throw ValidationException::withMessages([
                'message' => 'Tiket tidak tersedia.'
            ]);
        }

        $order->status = 'used';
        $order->save();

        // Tambahkan logika validasi tiket, cek status, dll

        return back()->with('success', 'Tiket valid: ' . $order->ticket_code);
    }
}
