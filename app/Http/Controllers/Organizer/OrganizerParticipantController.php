<?php

namespace App\Http\Controllers\Organizer;

use App\Exports\ParticipantsExport;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class OrganizerParticipantController extends Controller
{
    public function show($id)
    {

        // Cari berdasarkan ID terlebih dahulu
        $ticket = Ticket::find($id);

        // Jika tidak ditemukan berdasarkan ID, cari berdasarkan ticket_code
        if (!$ticket) {
            $ticket = Ticket::where('ticket_code', $id)->firstOrFail();
        }

        // Load semua relasi yang berhubungan dengan peserta ini
        $ticket->load([
            'user',
            'ticket_type',
            'event', // Untuk link kembali ke event
            'detail_pendaftar',
            'event_field_responses',
            'submission.submission_custom_fields'
        ]);

        return Inertia::render('Organizer/Participants/Show', [
            'ticket' => $ticket
        ]);
    }

    public function exportExcel(Event $event)
    {
        $fileName = 'Peserta_' . $event->slug . '_' . date('Y-md') . '.xlsx';
        $path = 'exports/' . $fileName;

        // 1. Simpan file secara fisik ke storage/app/public/exports/
        Excel::store(new ParticipantsExport($event->id), $path, 'public');

        // 2. Dapatkan URL lengkap dari file tersebut
        $downloadUrl = asset('storage/' . $path);

        // 3. Alihkan (redirect) user langsung ke link file tersebut
        // Browser akan otomatis men-downloadnya!
        return redirect($downloadUrl);
    }

    public function updateStatus(Request $request, Event $event, Ticket $ticket)
    {
        // Validasi input status yang diizinkan
        $request->validate([
            'status' => 'required|in:unused,used' // Sesuaikan jika ada status lain
        ]);

        // Pastikan tiket ini benar-benar milik event yang sedang dibuka
        if ($ticket->event_id !== $event->id) {
            return back()->with('error', 'Tiket tidak valid untuk event ini.');
        }

        // Update status tiket
        $ticket->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status kehadiran berhasil diperbarui!');
    }
}
