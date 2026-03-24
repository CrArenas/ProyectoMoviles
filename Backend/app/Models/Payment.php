<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id',
        'amount',
        'method',
        'date'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}