<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    private function mockTransactions(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'buy',
                'from_party' => ['id' => 1, 'name' => 'احمد شاه', 'type' => 'customer'],
                'to_party'   => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'weight_tola' => 2.5,
                'ayar' => 21,
                'amount_usd' => 475.00,
                'amount_afn' => 33250,
                'rate_per_tola_usd' => 190.0,
                'usd_to_afn_rate' => 70.0,
                'payment_method' => 'cash',
                'notes' => null,
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۰۵',
            ],
            [
                'id' => 2,
                'type' => 'sell',
                'from_party' => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'to_party'   => ['id' => 2, 'name' => 'مریم نوری', 'type' => 'customer'],
                'weight_tola' => 1.0,
                'ayar' => 18,
                'amount_usd' => 162.50,
                'amount_afn' => 11375,
                'rate_per_tola_usd' => 190.0,
                'usd_to_afn_rate' => 70.0,
                'payment_method' => 'cash',
                'notes' => null,
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۰۸',
            ],
            [
                'id' => 3,
                'type' => 'trust_deposit',
                'from_party' => ['id' => 3, 'name' => 'عبدالله کریمی', 'type' => 'customer'],
                'to_party'   => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'weight_tola' => 5.0,
                'ayar' => 24,
                'amount_usd' => null,
                'amount_afn' => null,
                'rate_per_tola_usd' => null,
                'usd_to_afn_rate' => null,
                'payment_method' => null,
                'notes' => 'امانت موقت تا پایان ماه',
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۱۲',
            ],
            [
                'id' => 4,
                'type' => 'buy',
                'from_party' => ['id' => 1, 'name' => 'احمد خان', 'type' => 'supplier'],
                'to_party'   => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'weight_tola' => 10.0,
                'ayar' => 24,
                'amount_usd' => 1900.00,
                'amount_afn' => 133000,
                'rate_per_tola_usd' => 190.0,
                'usd_to_afn_rate' => 70.0,
                'payment_method' => 'transfer',
                'notes' => 'خرید از سپلایر اصلی',
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۱۵',
            ],
            [
                'id' => 5,
                'type' => 'sell',
                'from_party' => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'to_party'   => ['id' => 4, 'name' => 'زرغونه میرزایی', 'type' => 'customer'],
                'weight_tola' => 0.5,
                'ayar' => 22,
                'amount_usd' => 95.00,
                'amount_afn' => 6650,
                'rate_per_tola_usd' => 190.0,
                'usd_to_afn_rate' => 70.0,
                'payment_method' => 'cash',
                'notes' => null,
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۱۸',
            ],
            [
                'id' => 6,
                'type' => 'transfer',
                'from_party' => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'to_party'   => ['id' => 2, 'name' => 'محمد ظاهر', 'type' => 'supplier'],
                'weight_tola' => 3.0,
                'ayar' => 24,
                'amount_usd' => null,
                'amount_afn' => null,
                'rate_per_tola_usd' => null,
                'usd_to_afn_rate' => null,
                'payment_method' => null,
                'notes' => 'انتقال به سپلایر هرات',
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۲۰',
            ],
            [
                'id' => 7,
                'type' => 'trust_withdraw',
                'from_party' => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'to_party'   => ['id' => 3, 'name' => 'عبدالله کریمی', 'type' => 'customer'],
                'weight_tola' => 2.0,
                'ayar' => 24,
                'amount_usd' => null,
                'amount_afn' => null,
                'rate_per_tola_usd' => null,
                'usd_to_afn_rate' => null,
                'payment_method' => null,
                'notes' => 'برداشت جزئی از امانت',
                'status' => 'completed',
                'created_at' => '۱۴۰۳/۱۰/۲۵',
            ],
            [
                'id' => 8,
                'type' => 'buy',
                'from_party' => ['id' => 5, 'name' => 'حمید رحیمی', 'type' => 'customer'],
                'to_party'   => ['id' => 0, 'name' => 'فروشگاه', 'type' => 'shop'],
                'weight_tola' => 4.0,
                'ayar' => 23,
                'amount_usd' => 730.00,
                'amount_afn' => 51100,
                'rate_per_tola_usd' => 190.0,
                'usd_to_afn_rate' => 70.0,
                'payment_method' => 'cash',
                'notes' => null,
                'status' => 'pending',
                'created_at' => '۱۴۰۳/۱۰/۲۸',
            ],
        ];
    }

    private function mockCustomers(): array
    {
        return [
            ['id' => 1, 'name' => 'احمد شاه'],
            ['id' => 2, 'name' => 'مریم نوری'],
            ['id' => 3, 'name' => 'عبدالله کریمی'],
            ['id' => 4, 'name' => 'زرغونه میرزایی'],
            ['id' => 5, 'name' => 'حمید رحیمی'],
            ['id' => 6, 'name' => 'فاطمه احمدی'],
        ];
    }

    private function mockSuppliers(): array
    {
        return [
            ['id' => 1, 'name' => 'احمد خان'],
            ['id' => 2, 'name' => 'محمد ظاهر'],
            ['id' => 3, 'name' => 'عبدالرحیم'],
            ['id' => 4, 'name' => 'نور محمد'],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('transactions/index', [
            'transactions' => $this->mockTransactions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('transactions/create', [
            'customers' => $this->mockCustomers(),
            'suppliers' => $this->mockSuppliers(),
        ]);
    }

    public function show(string $id): Response
    {
        $transactions = $this->mockTransactions();
        $transaction = collect($transactions)->firstWhere('id', (int) $id) ?? $transactions[0];

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }
}
