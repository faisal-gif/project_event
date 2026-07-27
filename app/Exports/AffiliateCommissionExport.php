<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class AffiliateCommissionExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithEvents
{
    protected Collection $rows;

    public function __construct(Collection $rows)
    {
        $this->rows = $rows;
    }

    public function collection()
    {
        $rows = $this->rows->values();

        if ($rows->isEmpty()) {
            return $rows;
        }

        // Baris total di paling bawah.
        return $rows->push([
            'event' => '',
            'affiliate' => 'TOTAL',
            'affiliate_email' => '',
            'tickets' => $rows->sum('tickets'),
            'trx_count' => $rows->sum('trx_count'),
            'commission' => $rows->sum('commission'),
        ]);
    }

    public function headings(): array
    {
        return ['Event', 'Affiliate', 'Email', 'Tiket Terjual', 'Transaksi', 'Komisi (Rp)'];
    }

    public function map($row): array
    {
        return [
            $row['event'],
            $row['affiliate'],
            $row['affiliate_email'],
            $row['tickets'],
            $row['trx_count'],
            $row['commission'],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $last = $sheet->getHighestRow();
                // Bold header + baris total.
                $sheet->getStyle('A1:F1')->getFont()->setBold(true);
                $sheet->getStyle("A{$last}:F{$last}")->getFont()->setBold(true);
            },
        ];
    }
}
