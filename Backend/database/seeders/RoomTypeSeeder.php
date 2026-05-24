<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roomTypes = [
            [
                'id' => 1,
                'name' => 'Estándar',
            ],
            [
                'id' => 2,
                'name' => 'Deluxe',
            ],
            [
                'id' => 3,
                'name' => 'Suite',
            ],
        ];

        foreach ($roomTypes as $roomType) {
            DB::table('room_types')->updateOrInsert(
                ['id' => $roomType['id']],
                $roomType + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
