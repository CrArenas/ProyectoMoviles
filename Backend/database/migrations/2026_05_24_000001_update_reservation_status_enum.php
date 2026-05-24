<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE reservations SET status = 'Activa' WHERE LOWER(status) = 'activa'");
        DB::statement("UPDATE reservations SET status = 'Finalizada' WHERE LOWER(status) = 'finalizada'");
        DB::statement("UPDATE reservations SET status = 'Cancelada' WHERE LOWER(status) = 'cancelada'");
        DB::statement("ALTER TABLE reservations MODIFY status ENUM('Activa', 'Pendiente de pago', 'Finalizada', 'Cancelada') NOT NULL DEFAULT 'Activa'");
    }

    public function down(): void
    {
        DB::statement("UPDATE reservations SET status = 'activa' WHERE status = 'Activa'");
        DB::statement("UPDATE reservations SET status = 'finalizada' WHERE status = 'Finalizada'");
        DB::statement("UPDATE reservations SET status = 'cancelada' WHERE status = 'Cancelada'");
        DB::statement("ALTER TABLE reservations MODIFY status ENUM('activa', 'finalizada', 'cancelada') NOT NULL DEFAULT 'activa'");
    }
};