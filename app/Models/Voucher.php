<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'code',
        'type',
        'value',
        'max_discount',
        'quota',
        'valid_until',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
