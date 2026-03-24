<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();

            $table->unsignedBigInteger('room_type_id')->constrained();
            $table->foreign('room_type_id')->references('id')->on('room_types');

            $table->string('description');

            $table->decimal('price', 10, 2);

            $table->enum('status', ['disponible', 'ocupada', 'mantenimiento'])
                  ->default('disponible');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
