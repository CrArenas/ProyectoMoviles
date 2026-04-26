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

Route::apiResource('roles', RoleController::class);
Route::apiResource('room_types', Room_typeController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('companions', CompanionController::class);