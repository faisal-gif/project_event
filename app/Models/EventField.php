<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventField extends Model
{
    protected $table = 'event_fields';
    protected $guarded = [];

    protected $casts = [
        'options' => 'array', 
        'is_required' => 'boolean',
    ];
}
