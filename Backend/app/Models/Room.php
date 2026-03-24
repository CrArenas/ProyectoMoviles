<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RoomType;
use App\Models\Reservation;

class Room extends Model
{
    protected $fillable = [
        'number',
        'room_type_id',
        'price',
        'status',
        'description'
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'room_id');
    }
}