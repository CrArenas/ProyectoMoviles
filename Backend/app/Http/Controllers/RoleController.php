<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{

    public function index()
    {
        $role = Role::paginate(10);
        return response()->json($role, 201);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $role = Role::create($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al crear el rol'], 500);
        }
        return response()->json($role, 201);
    }

    public function show(Role $role)
    {
        try {
            DB::beginTransaction();
            $role = Role::findOrFail($role->id);
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al retornar el rol'], 500);
        }
        return response()->json($role, 201);
    }

    public function update(Request $request, Role $role)
    {
        try {
            DB::beginTransaction();
            $role->update($request->all());
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar el rol'], 500);
        }
        return response()->json($role, 201);
    }

    public function destroy(Role $role)
    {
        try {
            DB::beginTransaction();
            $role = Role::findOrFail($role->id);
            $role->delete();
            DB::commit();
        } 
        catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al eliminar el rol'], 500);
        }
        return response()->json($role, 201);
    }
}