<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->paginate(20);
        return response()->json($users, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = User::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el usuario'], 500);
        }
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        try {
            DB::beginTransaction();
            $user = User::findOrFail($user->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el usuario'], 500);
        }
        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        try {
            DB::beginTransaction();
            $user->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el usuario'], 500);
        }
        return response()->json($user, 201);
    }

    public function destroy(User $user)
    {
        try {
            DB::beginTransaction();
            $user = User::findOrFail($user->id);
            $user->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el usuario'], 500);
        }
        return response()->json($user, 201);
    }
}
