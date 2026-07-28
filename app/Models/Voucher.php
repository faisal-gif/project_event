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

    // Voucher berlaku untuk event ini? (event_id null = berlaku semua event)
    public function appliesToEvent($eventId): bool
    {
        return is_null($this->event_id) || (int) $this->event_id === (int) $eventId;
    }

    // Hitung nominal potongan untuk harga kotor tertentu (tidak melebihi harga).
    public function computeDiscount(int $gross): int
    {
        if ($this->type === 'percent') {
            $discount = (int) floor($gross * $this->value / 100);
            if ($this->max_discount) {
                $discount = min($discount, (int) $this->max_discount);
            }
        } else {
            $discount = (int) $this->value;
        }

        return max(0, min($discount, $gross));
    }
}
