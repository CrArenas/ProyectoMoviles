<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'id' => 1,
                'number' => '101',
                'room_type_id' => 1,
                'description' => 'Habitación estándar con cama matrimonial.',
                'price' => 45.00,
                'status' => 'disponible',
            ],
            [
                'id' => 2,
                'number' => '201',
                'room_type_id' => 2,
                'description' => 'Habitación deluxe con vista interna.',
                'price' => 70.00,
                'status' => 'disponible',
            ],
            [
                'id' => 3,
                'number' => '301',
                'room_type_id' => 3,
                'description' => 'Suite amplia para estancias largas.',
                'price' => 110.00,
                'status' => 'mantenimiento',
            ],
        ];

        foreach ($rooms as $room) {
            DB::table('rooms')->updateOrInsert(
                ['id' => $room['id']],
                $room + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
