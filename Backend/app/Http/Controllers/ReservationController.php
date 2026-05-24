<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index()
    {
        $reservation = Reservation::with(['room.roomType', 'companions', 'payments'])
            ->where('user_id', auth('api')->id())
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($reservation, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'status' => ['sometimes', 'in:activa,finalizada,cancelada'],
        ]);

        $room = Room::findOrFail($validated['room_id']);

        if ($room->status !== 'disponible') {
            return response()->json(['error' => 'La habitación no está disponible'], 422);
        }

        $nights = Carbon::parse($validated['check_in'])->diffInDays(Carbon::parse($validated['check_out']));
        $total = $room->price * $nights;

        try {
            DB::beginTransaction();
            $reservation = Reservation::create([
                'user_id' => auth('api')->id(),
                'room_id' => $validated['room_id'],
                'check_in' => $validated['check_in'],
                'check_out' => $validated['check_out'],
                'total' => $total,
                'status' => $validated['status'] ?? 'activa',
            ]);

            if ($reservation->status === 'activa') {
                $room->update(['status' => 'ocupada']);
            }

            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear la reserva'], 500);
        }
        return response()->json($reservation->load(['room.roomType', 'companions', 'payments']), 201);
    }

    public function show(Reservation $reservation)
    {
        $reservation->load(['room.roomType', 'companions', 'payments']);

        if ($reservation->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para ver esta reserva'], 403);
        }

        try {
            DB::beginTransaction();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar la reserva'], 500);
        }
        return response()->json($reservation, 200);
    }

    public function update(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para actualizar esta reserva'], 403);
        }

        $validated = $request->validate([
            'room_id' => ['sometimes', 'integer', 'exists:rooms,id'],
            'check_in' => ['sometimes', 'date'],
            'check_out' => ['sometimes', 'date'],
            'status' => ['sometimes', 'in:activa,finalizada,cancelada'],
        ]);

        $nextRoomId = $validated['room_id'] ?? $reservation->room_id;
        $nextCheckIn = $validated['check_in'] ?? $reservation->check_in;
        $nextCheckOut = $validated['check_out'] ?? $reservation->check_out;
        $nextStatus = $validated['status'] ?? $reservation->status;

        if (Carbon::parse($nextCheckOut)->lessThanOrEqualTo(Carbon::parse($nextCheckIn))) {
            return response()->json(['error' => 'La fecha de salida debe ser posterior a la fecha de entrada'], 422);
        }

        $nextRoom = Room::findOrFail($nextRoomId);

        if ($nextRoomId !== $reservation->room_id && $nextRoom->status !== 'disponible') {
            return response()->json(['error' => 'La nueva habitación no está disponible'], 422);
        }

        $nights = Carbon::parse($nextCheckIn)->diffInDays(Carbon::parse($nextCheckOut));
        $nextTotal = $nextRoom->price * $nights;

        try {
            DB::beginTransaction();

            $previousRoom = Room::find($reservation->room_id);

            $reservation->update([
                'room_id' => $nextRoomId,
                'check_in' => $nextCheckIn,
                'check_out' => $nextCheckOut,
                'total' => $nextTotal,
                'status' => $nextStatus,
            ]);

            if ($previousRoom && $previousRoom->id !== $nextRoom->id) {
                $previousRoom->update(['status' => 'disponible']);
            }

            if ($nextStatus === 'activa') {
                $nextRoom->update(['status' => 'ocupada']);
            } else {
                $nextRoom->update(['status' => 'disponible']);
            }

            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar la reserva'], 500);
        }
        return response()->json($reservation->fresh(['room.roomType', 'companions', 'payments']), 200);
    }

    public function destroy(Reservation $reservation)
     {
        if ($reservation->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para eliminar esta reserva'], 403);
        }

        try {
            DB::beginTransaction();
            $room = Room::find($reservation->room_id);

            if ($room) {
                $room->update(['status' => 'disponible']);
            }

            $reservation->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar la reserva'], 500);
        }
        return response()->json(['message' => 'Reserva eliminada correctamente'], 200);
    }
}
