<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryEvents extends Model
{
    protected $fillable = ['name', 'slug', 'icon'];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
