<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payments = [
            [
                'id' => 1,
                'reservation_id' => 1,
                'amount' => 90.00,
                'method' => 'efectivo',
                'date' => '2026-06-01',
            ],
            [
                'id' => 2,
                'reservation_id' => 2,
                'amount' => 140.00,
                'method' => 'tarjeta',
                'date' => '2026-06-10',
            ],
        ];

        foreach ($payments as $payment) {
            DB::table('payments')->updateOrInsert(
                ['id' => $payment['id']],
                $payment + [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
