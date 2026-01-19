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
    $event = $ticket->event->load('eventSubmissionFields');
    $user = auth()->user();

    $fieldRules = [];
    $customMessages = [];

    // 1. Bangun Rules dan Messages secara dinamis
    if ($event->needs_submission) {
        foreach ($event->eventSubmissionFields as $field) {
            $rules = $field->is_required ? ['required'] : ['nullable'];
            
            // Tambahkan validasi spesifik tipe
            if ($field->type === 'image') {
                $rules[] = 'image';
                $rules[] = 'max:2048'; // 2MB
            } elseif ($field->type === 'file') {
                $rules[] = 'file';
                $rules[] = 'max:5120'; // 5MB
            }

            $fieldRules[$field->name] = $rules;
            
            // Custom Messages
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

            // 4. Proses Simpan Data (Termasuk File)
            foreach ($validated as $fieldName => $fieldValue) {
                $finalValue = $fieldValue;

                // Jika input adalah file, simpan ke storage
                if ($request->hasFile($fieldName)) {
                    $file = $request->file($fieldName);
                    // Simpan di folder: public/submissions/{event_id}/{field_name}
                    $path = $file->store("uploads/submissions/{$event->slug}/{$fieldName}", 'public');
                    $finalValue = $path;
                }

                // Simpan ke tabel relasional
                SubmissionCustomFields::create([
                    'submission_id' => $submission->id,
                    'field_name' => $fieldName,
                    'field_value' => $finalValue, // Berisi teks atau path file
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
