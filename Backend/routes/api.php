<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExampleController;

    Route::get('/examples', [ExampleController::class, 'index']);
    Route::post('/examples', [ExampleController::class, 'store']);
    Route::get('/examples/{id}', [ExampleController::class, 'show']);