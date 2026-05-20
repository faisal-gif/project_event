<?php

namespace App\Exports;

use App\Models\Ticket;
use App\Models\EventField;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ParticipantsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $eventId;
    protected $dynamicFields;

    public function __construct($eventId)
    {
        $this->eventId = $eventId;
        
        // Ambil semua NAMA kolom custom dari database (untuk dijadikan Header Excel)
        $this->dynamicFields = EventField::where('event_id', $eventId)->pluck('name')->toArray();
    }

    public function collection()
    {
        // Ambil data Tiket beserta relasinya (Hanya yang lunas/PAID)
        return Ticket::with(['detail_pendaftar', 'ticket_type', 'event_field_responses'])
            ->where('event_id', $this->eventId)
            ->whereHas('transaction', function($q) {
                $q->where('status', 'PAID');
            })
            ->get();
    }

    public function headings(): array
    {
        // Kolom Statis / Bawaan
        $baseHeadings = [
            'Kode Tiket', 
            'Tipe Tiket', 
            'Nama Pendaftar', 
            'Email', 
            'No. HP', 
            'Usia', 
            'Pekerjaan', 
            'Status Kehadiran'
        ];

        // Gabungkan dengan Kolom Dinamis (Nama-nama pertanyaan tambahan)
        // Kita ubah snake_case (foto_ktp) menjadi Title Case (Foto Ktp) agar rapi
        $formattedDynamicFields = array_map(function($field) {
            return ucwords(str_replace('_', ' ', $field));
        }, $this->dynamicFields);

        return array_merge($baseHeadings, $formattedDynamicFields);
    }

    public function map($ticket): array
    {
        // Data Statis
        $baseData = [
            $ticket->ticket_code,
            $ticket->ticket_type->name ?? '-',
            $ticket->detail_pendaftar->nama ?? '-',
            $ticket->detail_pendaftar->email ?? '-',
            $ticket->detail_pendaftar->no_hp ?? '-',
            $ticket->detail_pendaftar->usia ?? '-',
            $ticket->detail_pendaftar->pekerjaan ?? '-',
            strtoupper($ticket->status), // unused / used
        ];

        // Data Dinamis (Jawaban Peserta)
        $dynamicData = [];
        // Jadikan responses ke format Key-Value agar mudah dicari berdasarkan nama field
        $responses = $ticket->event_field_responses->keyBy('field_name');

        foreach ($this->dynamicFields as $field) {
            $value = '-';

            if (isset($responses[$field])) {
                $type = $responses[$field]->field_type;
                $val = $responses[$field]->field_value;

                // Jika jawabannya berupa file/gambar, jadikan URL lengkap agar bisa di-klik di Excel
                if (in_array($type, ['image', 'file']) && $val) {
                    $value = url('storage/' . $val);
                } else {
                    $value = $val;
                }
            }

            $dynamicData[] = $value;
        }

        return array_merge($baseData, $dynamicData);
    }
}