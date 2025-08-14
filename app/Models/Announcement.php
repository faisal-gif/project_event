<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['title', 'content', 'event_id', 'scheduled_at', 'published'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
