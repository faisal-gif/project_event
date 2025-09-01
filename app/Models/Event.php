<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $guarded = [];

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
}
