<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'role_id' => 1,
                'name' => 'Juan',
                'last_name' => 'Perez',
                'email' => 'juan.perez@example.com',
                'password' => Hash::make('password'),
                'phone' => '8095551001',
                'birth_date' => '1995-05-10',
            ],
            [
                'id' => 2,
                'role_id' => 2,
                'name' => 'Admin',
                'last_name' => 'Sistema',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'phone' => '8095551002',
                'birth_date' => '1990-01-01',
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['id' => $user['id']],
                $user + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
