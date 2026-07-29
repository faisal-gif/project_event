<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $eventId;

    public function __construct($eventId)
    {
        $this->eventId = $eventId;
    }

    public function collection()
    {
        return Transaction::with('user')
            ->where('event_id', $this->eventId)
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return ['Referensi', 'Nama', 'Email', 'Status', 'Metode Bayar', 'Jumlah Tiket', 'Amount', 'Subtotal', 'Tanggal'];
    }

    public function map($t): array
    {
        return [
            $t->reference,
            $t->user?->name ?? '-',
            $t->user?->email ?? '-',
            $t->status,
            $t->payment_method,
            $t->quantity,
            $t->amount,
            $t->subtotal,
            optional($t->created_at)->format('Y-m-d H:i'),
        ];
    }
}
