<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $guarded = [];

    protected $casts = [
        'ticket_additional_questions' => 'array', // atau 'object'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function detail_pendaftar()
    {
        return $this->belongsTo(DetailPendaftar::class);
    }

    public function event_field_responses()
    {
        return $this->hasMany(EventFieldResponse::class);
    }

    public function submission()
    {
        return $this->hasOne(Submission::class);
    }
}
