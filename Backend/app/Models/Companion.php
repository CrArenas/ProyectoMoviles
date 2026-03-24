<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;

class Companion extends Model
{
    protected $fillable = [
        'reservation_id',
        'name',
        'document',
        'relationship'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}