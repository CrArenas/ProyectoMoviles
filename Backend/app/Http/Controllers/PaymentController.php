<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        $payment = Payment::with('reservation')->paginate(10);
        return response()->json($payment, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $payment = Payment::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el pago'], 500);
        }
        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        try {
            DB::beginTransaction();
            $payment = Payment::findOrFail($payment->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el pago'], 500);
        }
        return response()->json($payment, 201);
    }

    public function update(Request $request, Payment $payment)
     {
        try {
            DB::beginTransaction();
            $payment->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el pago'], 500);
        }
        return response()->json($payment, 201);
    }

    public function destroy(Payment $payment)
     {
        try {
            DB::beginTransaction();
            $payment = Payment::findOrFail($payment->id);
            $payment->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el pago'], 500);
        }
        return response()->json($payment, 201);
     }
}
