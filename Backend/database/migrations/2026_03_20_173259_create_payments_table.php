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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('reservation_id')->constrained();
            $table->foreign('reservation_id')->references('id')->on('reservations');

            // Agrega el campo de monto, con 10 números enteros máximos y 2 decimales
            $table->decimal('amount', 10, 2);

            $table->enum('method', ['efectivo', 'tarjeta', 'transferencia'])
                  ->default('efectivo');

            $table->date('date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
