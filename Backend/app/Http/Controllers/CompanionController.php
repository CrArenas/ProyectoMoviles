<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Companion;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class CompanionController extends Controller
{
    public function index()
    {
        $companion = Companion::with('reservation')
            ->whereHas('reservation', function ($query) {
                $query->where('user_id', auth('api')->id());
            })
            ->paginate(10);

        return response()->json($companion, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'name' => ['required', 'string', 'max:255'],
            'document' => ['nullable', 'string', 'max:255'],
            'relationship' => ['nullable', 'string', 'max:255'],
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        if ($reservation->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No puedes agregar acompañantes a una reserva que no te pertenece'], 403);
        }

        try {
            DB::beginTransaction();
            $companion = Companion::create($validated);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el acompañante'], 500);
        }
        return response()->json($companion, 201);
    }

    public function show(Companion $companion)
    {
        $companion->load('reservation');

        if ($companion->reservation?->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para ver este acompañante'], 403);
        }

        try {
            DB::beginTransaction();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el acompañante'], 500);
        }
        return response()->json($companion, 200);
    }

    public function update(Request $request, Companion $companion)
     {
        $companion->load('reservation');

        if ($companion->reservation?->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para actualizar este acompañante'], 403);
        }

        $validated = $request->validate([
            'reservation_id' => ['sometimes', 'integer', 'exists:reservations,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'document' => ['nullable', 'string', 'max:255'],
            'relationship' => ['nullable', 'string', 'max:255'],
        ]);

        if (array_key_exists('reservation_id', $validated)) {
            $reservation = Reservation::findOrFail($validated['reservation_id']);

            if ($reservation->user_id !== auth('api')->id()) {
                return response()->json(['error' => 'No puedes mover este acompañante a una reserva que no te pertenece'], 403);
            }
        }

        try {
            DB::beginTransaction();
            $companion->update($validated);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el acompañante'], 500);
        }
        return response()->json($companion->fresh('reservation'), 200);
    }

    public function destroy(Companion $companion)
     {
        $companion->load('reservation');

        if ($companion->reservation?->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No tienes permisos para eliminar este acompañante'], 403);
        }

        try {
            DB::beginTransaction();
            $companion->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el acompañante'], 500);
        }
        return response()->json(['message' => 'Acompañante eliminado correctamente'], 200);
     }
}
