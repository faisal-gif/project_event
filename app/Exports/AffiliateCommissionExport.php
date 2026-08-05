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
        // Flatten agregat -> satu baris per transaksi (rincian).
        $flat = collect();
        foreach ($this->rows as $row) {
            foreach ($row['details'] as $d) {
                $flat->push([
                    'event' => $row['event'],
                    'affiliate' => $row['affiliate'],
                    'affiliate_email' => $row['affiliate_email'],
                    'buyer' => $d['buyer'],
                    'ticket_type' => $d['ticket_type'],
                    'price' => $d['price'],
                    'qty' => $d['qty'],
                    'commission_per_ticket' => $d['commission_per_ticket'],
                    'commission' => $d['commission'],
                ]);
            }
        }

        if ($flat->isEmpty()) {
            return $flat;
        }

        // Baris total di paling bawah.
        return $flat->push([
            'event' => '',
            'affiliate' => '',
            'affiliate_email' => '',
            'buyer' => '',
            'ticket_type' => '',
            'price' => 'TOTAL',
            'qty' => $flat->sum('qty'),
            'commission_per_ticket' => '',
            'commission' => $flat->sum('commission'),
        ]);
    }

    public function headings(): array
    {
        return ['Event', 'Affiliate', 'Email', 'Pembeli', 'Jenis Tiket', 'Harga Tiket', 'Jumlah Tiket', 'Komisi/Tiket', 'Komisi (Rp)'];
    }

    public function map($row): array
    {
        return [
            $row['event'],
            $row['affiliate'],
            $row['affiliate_email'],
            $row['buyer'],
            $row['ticket_type'],
            $row['price'],
            $row['qty'],
            $row['commission_per_ticket'],
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
                $sheet->getStyle('A1:I1')->getFont()->setBold(true);
                $sheet->getStyle("A{$last}:I{$last}")->getFont()->setBold(true);
            },
        ];
    }
}
