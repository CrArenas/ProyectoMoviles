<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function index()
    {
        $reservation = Reservation::with('user', 'room')->paginate(10);
        return response()->json($reservation, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $reservation = Reservation::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear la reserva'], 500);
        }
        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation)
    {
        try {
            DB::beginTransaction();
            $reservation = Reservation::findOrFail($reservation->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar la reserva'], 500);
        }
        return response()->json($reservation, 201);
    }

    public function update(Request $request, Reservation $reservation)
    {
        try {
            DB::beginTransaction();
            $reservation->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar la reserva'], 500);
        }
        return response()->json($reservation, 201);
    }

    public function destroy(Reservation $reservation)
     {
        try {
            DB::beginTransaction();
            $reservation = Reservation::findOrFail($reservation->id);
            $reservation->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar la reserva'], 500);
        }
        return response()->json($reservation, 201);
    }
}
