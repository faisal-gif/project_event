<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['price_range', 'total_quota', 'total_remaining_quota'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function category()
    {
        return $this->belongsTo(CategoryEvents::class);
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class);
    }

    public function eventFields()
    {
        return $this->hasMany(EventField::class);
    }

    public function eventSubmissionFields()
    {
        return $this->hasMany(EventSubmissionField::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    public function judges()
    {
        return $this->belongsToMany(User::class, 'event_judges', 'event_id', 'user_id')
            ->where('role', 'judge'); // Opsional: memastikan hanya user dengan role judge yang terpanggil
    }

    public function getTotalQuotaAttribute()
    {
        // Ensure ticketTypes relationship is loaded to avoid N+1 problems
        if (!$this->relationLoaded('ticketTypes')) {
            $this->load('ticketTypes');
        }
        return $this->ticketTypes->sum('quota');
    }

    public function getTotalRemainingQuotaAttribute()
    {
        if (!$this->relationLoaded('ticketTypes')) {
            $this->load('ticketTypes');
        }
        return $this->ticketTypes->sum('remaining_quota');
    }

    public function getPriceRangeAttribute()
    {
        if (!$this->relationLoaded('ticketTypes')) {
            $this->load('ticketTypes');
        }

        if ($this->ticketTypes->isEmpty()) {
            return null; // Or return a default like [0, 0]
        }

        $min = $this->ticketTypes->min('price');
        $max = $this->ticketTypes->max('price');

        return [$min, $max];
    }
}
