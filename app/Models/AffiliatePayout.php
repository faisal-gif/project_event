<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AffiliatePayout extends Model
{
    protected $guarded = [];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'float',
    ];

    public function promoter()
    {
        return $this->belongsTo(User::class, 'promoter_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'payout_id');
    }
}
