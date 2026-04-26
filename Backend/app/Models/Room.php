<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;
use App\Models\RoomType;
use App\Models\Reservation;

class Room extends Model implements Auditable
{

    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, AuditableTrait;

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