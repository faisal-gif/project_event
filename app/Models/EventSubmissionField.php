<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSubmissionField extends Model
{
    protected $table = 'event_submission_fields';
    protected $guarded = [];


    protected $casts = [
        'options' => 'array',        // Ini kuncinya!
        'is_required' => 'boolean',
    ];
}
