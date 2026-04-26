<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Companion;
use Illuminate\Support\Facades\DB;

class CompanionController extends Controller
{
    public function index()
    {
        $companion = Companion::with('reservation')->paginate(10);
        return response()->json($companion, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $companion = Companion::create($request->all());
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
        try {
            DB::beginTransaction();
            $companion = Companion::findOrFail($companion->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el acompañante'], 500);
        }
        return response()->json($companion, 201);
    }

    public function update(Request $request, Companion $companion)
     {
        try {
            DB::beginTransaction();
            $companion->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el acompañante'], 500);
        }
        return response()->json($companion, 201);
    }

    public function destroy(Companion $companion)
     {
        try {
            DB::beginTransaction();
            $companion = Companion::findOrFail($companion->id);
            $companion->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el acompañante'], 500);
        }
        return response()->json($companion, 201);
     }
}
