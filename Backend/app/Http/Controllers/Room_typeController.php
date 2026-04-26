<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class Room_typeController extends Controller
{
    public function index()
    {
        $roomType = RoomType::paginate(10);
        return response()->json($roomType, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $roomType = RoomType::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el tipo de habitación'], 500);
        }
        return response()->json($roomType, 201);
    }

    public function show(RoomType $roomType)
    {
        try {
            DB::beginTransaction();
            $roomType = RoomType::findOrFail($roomType->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el tipo de habitación'], 500);
        }
        return response()->json($roomType, 201);
    }

    public function update(Request $request, RoomType $roomType)
    {
        try {
            DB::beginTransaction();
            $roomType->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el tipo de habitación'], 500);
        }
        return response()->json($roomType, 201);
    }

    public function destroy(RoomType $roomType)
     {
        try {
            DB::beginTransaction();
            $roomType = RoomType::findOrFail($roomType->id);
            $roomType->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el tipo de habitación'], 500);
        }
        return response()->json($roomType, 201);
    }
}
