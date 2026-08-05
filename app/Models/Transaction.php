<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];

    protected $casts = [
        'field_responses' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Affiliate/promotor yang menghasilkan transaksi ini.
    public function promoter()
    {
        return $this->belongsTo(User::class, 'promoter_id');
    }
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function ticketType()
    {
        return $this->belongsTo(TicketType::class);
    }

    // Payout yang melunasi komisi transaksi ini (null = belum dibayar).
    public function payout()
    {
        return $this->belongsTo(AffiliatePayout::class, 'payout_id');
    }
}
