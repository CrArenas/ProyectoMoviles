<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{

    public function index()
    {
      $roles = Role::all();
      return response()->json($roles);
    }

    public function store(Request $request)
    {
        $rol = new Role();
        $rol->name = $request->name;
        $rol->save();
        return response()->json($rol);
    }

    public function show(string $id)
    {
        $rol = Role::find($id);
        return response()->json($rol);
    }

    public function update(Request $request, string $id)
    {
        $rol = Role::find($id);
        $rol->name = $request->name;
        $rol->save();
        return response()->json($rol);
    }

    public function destroy(string $id)
    {
        $rol = Role::find($id);
        $rol->delete();
        return response()->json($rol);
    }
}