<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companions = [
            [
                'id' => 1,
                'reservation_id' => 1,
                'name' => 'Maria Perez',
                'document' => '001-1234567-8',
                'relationship' => 'esposa',
            ],
            [
                'id' => 2,
                'reservation_id' => 2,
                'name' => 'Carlos Gomez',
                'document' => '402-7654321-9',
                'relationship' => 'amigo',
            ],
        ];

        foreach ($companions as $companion) {
            DB::table('companions')->updateOrInsert(
                ['id' => $companion['id']],
                $companion + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
