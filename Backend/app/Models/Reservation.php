<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Room;
use App\Models\Payment;
use App\Models\Companion;

class Reservation extends Model implements Auditable
{

    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, AuditableTrait;

    protected $fillable = [
        'user_id',
        'room_id',
        'check_in',
        'check_out',
        'total',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'reservation_id');
    }

    public function companions()
    {
        return $this->hasMany(Companion::class, 'reservation_id');
    }
}