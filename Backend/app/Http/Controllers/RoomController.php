<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with('roomType')->paginate(10);
        return response()->json($rooms, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $room = Room::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear la habitación'], 500);
        }
        return response()->json($room, 201);
    }

    public function show(Room $room)
    {
        try {
            DB::beginTransaction();
            $room = Room::findOrFail($room->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar la habitación'], 500);
        }
        return response()->json($room, 201);
    }

    public function update(Request $request, Room $room)
    {
        try {
            DB::beginTransaction();
            $room->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar la habitación'], 500);
        }
        return response()->json($room, 201);
    }

    public function destroy(Room $room)
    {
        try {
            DB::beginTransaction();
            $room = Room::findOrFail($room->id);
            $room->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar la habitación'], 500);
        }
        return response()->json($room, 201);
    }
}
