<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservations = [
            [
                'id' => 1,
                'user_id' => 1,
                'room_id' => 1,
                'check_in' => '2026-06-01',
                'check_out' => '2026-06-03',
                'total' => 90.00,
                'status' => 'activa',
            ],
            [
                'id' => 2,
                'user_id' => 2,
                'room_id' => 2,
                'check_in' => '2026-06-10',
                'check_out' => '2026-06-12',
                'total' => 140.00,
                'status' => 'finalizada',
            ],
        ];

        foreach ($reservations as $reservation) {
            DB::table('reservations')->updateOrInsert(
                ['id' => $reservation['id']],
                $reservation + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
