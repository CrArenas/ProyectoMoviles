<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->constrained();
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('room_id')->constrained();
            $table->foreign('room_id')->references('id')->on('rooms');

            $table->date('check_in');
            $table->date('check_out');

            $table->decimal('total', 10, 2)->default(0);

            $table->enum('status', ['activa', 'finalizada', 'cancelada'])
                  ->default('activa');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
