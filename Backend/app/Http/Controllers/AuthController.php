<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        $user = JWTAuth::user();

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'user' => $user?->load('role')
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:20'],
            'birth_date' => ['required', 'date'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => 2,
            'phone' => $validated['phone'],
            'birth_date' => $validated['birth_date']
        ]);

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user' => $user->load('role'),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()?->load('role')
        ]);
    }

    public function logout()
    {
        $token = JWTAuth::getToken();

        if ($token) {
            JWTAuth::invalidate($token);
        }

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

}
