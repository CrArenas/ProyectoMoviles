<?php

use App\Http\Controllers\AdminPanelController;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return auth()->check() && auth()->user()?->role?->label === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('login');
});

Route::get('/login', [AdminPanelController::class, 'showLogin'])->name('login');
Route::post('/login', [AdminPanelController::class, 'login'])->name('login.store');
Route::post('/logout', [AdminPanelController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminPanelController::class, 'dashboard'])->name('dashboard');

    Route::get('/{resource}/create', [AdminPanelController::class, 'create'])
        ->name('resource.create');

    Route::post('/{resource}', [AdminPanelController::class, 'store'])
        ->name('resource.store');

    Route::get('/{resource}/{id}/edit', [AdminPanelController::class, 'edit'])
        ->whereNumber('id')
        ->name('resource.edit');

    Route::put('/{resource}/{id}', [AdminPanelController::class, 'update'])
        ->whereNumber('id')
        ->name('resource.update');

    Route::delete('/{resource}/{id}', [AdminPanelController::class, 'destroy'])
        ->whereNumber('id')
        ->name('resource.destroy');

    Route::get('/{resource}/{id}', [AdminPanelController::class, 'show'])
        ->whereNumber('id')
        ->name('resource.show');

    Route::get('/{resource}', [AdminPanelController::class, 'index'])
        ->name('resource.index');
});
