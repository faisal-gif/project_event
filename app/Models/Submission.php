<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $table = 'submissions';
    protected $guarded = [];


    public function submission_custom_fields()
    {
        return $this->hasMany(SubmissionCustomFields::class);
    }
}
