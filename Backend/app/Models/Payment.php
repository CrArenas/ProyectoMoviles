<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;

class Payment extends Model implements Auditable
{

    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, AuditableTrait;

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