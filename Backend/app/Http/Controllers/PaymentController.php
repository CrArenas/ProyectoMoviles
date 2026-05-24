<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        $payment = Payment::with('reservation')->paginate(10);
        return response()->json($payment, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'method' => ['sometimes', 'in:efectivo,tarjeta,transferencia'],
            'date' => ['sometimes', 'date'],
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        if ($reservation->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No puedes registrar un pago de una reserva que no te pertenece'], 403);
        }

        if (Payment::where('reservation_id', $reservation->id)->exists()) {
            return response()->json(['error' => 'La reserva ya tiene un pago registrado'], 422);
        }

        try {
            DB::beginTransaction();
            $payment = Payment::create([
                'reservation_id' => $reservation->id,
                'amount' => $reservation->total,
                'method' => $validated['method'] ?? 'efectivo',
                'date' => $validated['date'] ?? Carbon::today()->toDateString(),
            ]);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el pago'], 500);
        }
        return response()->json($payment, 201);
    }

    public function show($id)
    {
        try {
            DB::beginTransaction();
            $payment = Payment::with('reservation')->findOrFail($id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el pago'], 500);
        }
        return response()->json($payment, 200);
    }

    public function update(Request $request, $id)
     {
        $validated = $request->validate([
            'reservation_id' => ['sometimes', 'integer', 'exists:reservations,id'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'method' => ['sometimes', 'in:efectivo,tarjeta,transferencia'],
            'date' => ['sometimes', 'date'],
        ]);

        try {
            DB::beginTransaction();
            $payment = Payment::findOrFail($id);
            $payment->update($validated);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el pago'], 500);
        }
        return response()->json($payment->fresh('reservation'), 200);
    }

    public function destroy($id)
     {
        try {
            DB::beginTransaction();
            $payment = Payment::findOrFail($id);
            $payment->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el pago'], 500);
        }
        return response()->json(['message' => 'Pago eliminado correctamente'], 200);
     }
}
