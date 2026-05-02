<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Room_typeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanionController;
use App\Http\Controllers\AuthController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::apiResource('companions', CompanionController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::post('payments', [PaymentController::class, 'store']);
});

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('payments', [PaymentController::class, 'index']);
    Route::get('payments/{id}', [PaymentController::class, 'show']);
    Route::put('payments/{id}', [PaymentController::class, 'update']);
    Route::delete('payments/{id}', [PaymentController::class, 'destroy']);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('room_types', Room_typeController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('users', UserController::class);
});