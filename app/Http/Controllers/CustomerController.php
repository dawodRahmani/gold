<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class CustomerController extends Controller
{
    private function mockCustomers(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'احمد شاه محمدزی',
                'phone' => '0700-123-456',
                'whatsapp' => '93700123456',
                'type' => 'permanent',
                'city' => 'کابل',
                'address' => 'کارته سه، کوچه دوم',
                'id_number' => '3456789012',
                'pasa_balance' => 2.5,
                'gold_balance' => 1.2,
                'usd_balance' => 1500.00,
                'afn_balance' => 25000.00,
                'notes' => 'مشتری قدیمی و معتبر',
                'created_at' => '۱۴۰۳/۰۳/۱۵',
            ],
            [
                'id' => 2,
                'name' => 'فاطمه نوری',
                'phone' => '0799-456-789',
                'whatsapp' => '93799456789',
                'type' => 'permanent',
                'city' => 'مزار شریف',
                'address' => 'سرک پنجم، بلاک الف',
                'id_number' => '7890123456',
                'pasa_balance' => 0.75,
                'gold_balance' => 0.0,
                'usd_balance' => 800.00,
                'afn_balance' => 12000.00,
                'notes' => '',
                'created_at' => '۱۴۰۳/۰۴/۲۰',
            ],
            [
                'id' => 3,
                'name' => 'محمد حسین رضایی',
                'phone' => '0707-789-012',
                'whatsapp' => '93707789012',
                'type' => 'permanent',
                'city' => 'هرات',
                'address' => 'بازار قدیم، دکان نمبر ۱۲',
                'id_number' => '1234567890',
                'pasa_balance' => 5.0,
                'gold_balance' => 3.5,
                'usd_balance' => 4200.00,
                'afn_balance' => 85000.00,
                'notes' => 'سپلایر اصلی از هرات',
                'created_at' => '۱۴۰۲/۱۱/۰۵',
            ],
            [
                'id' => 4,
                'name' => 'ملیحه صادقی',
                'phone' => '0790-345-678',
                'whatsapp' => null,
                'type' => 'ordinary',
                'city' => null,
                'address' => null,
                'id_number' => null,
                'pasa_balance' => 0.0,
                'gold_balance' => 0.3,
                'usd_balance' => 0.0,
                'afn_balance' => 5000.00,
                'notes' => '',
                'created_at' => '۱۴۰۳/۰۷/۱۰',
            ],
            [
                'id' => 5,
                'name' => 'عبدالرحیم خان',
                'phone' => '0780-567-890',
                'whatsapp' => null,
                'type' => 'ordinary',
                'city' => null,
                'address' => null,
                'id_number' => null,
                'pasa_balance' => 0.0,
                'gold_balance' => 0.0,
                'usd_balance' => 250.00,
                'afn_balance' => 0.0,
                'notes' => 'خرید یک بار',
                'created_at' => '۱۴۰۳/۰۸/۰۱',
            ],
            [
                'id' => 6,
                'name' => 'زینب احمدی',
                'phone' => '0702-901-234',
                'whatsapp' => '93702901234',
                'type' => 'permanent',
                'city' => 'جلال‌آباد',
                'address' => 'بازار مرکزی، طبقه دوم',
                'id_number' => '5678901234',
                'pasa_balance' => 1.25,
                'gold_balance' => 0.5,
                'usd_balance' => 950.00,
                'afn_balance' => 18000.00,
                'notes' => '',
                'created_at' => '۱۴۰۳/۰۳/۱۲',
            ],
        ];
    }

    private function mockTransactions(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'buy',
                'type_label' => 'خرید طلا',
                'weight_tola' => 1.5,
                'ayar' => 22,
                'amount_usd' => 1800.00,
                'amount_afn' => 124200.00,
                'notes' => '',
                'created_at' => '۱۴۰۳/۰۸/۱۵',
            ],
            [
                'id' => 2,
                'type' => 'sell',
                'type_label' => 'فروش طلا',
                'weight_tola' => 0.75,
                'ayar' => 24,
                'amount_usd' => 1050.00,
                'amount_afn' => 72450.00,
                'notes' => 'پاسا',
                'created_at' => '۱۴۰۳/۰۷/۲۲',
            ],
            [
                'id' => 3,
                'type' => 'trust_deposit',
                'type_label' => 'امانت‌گذاری',
                'weight_tola' => 2.0,
                'ayar' => 21,
                'amount_usd' => null,
                'amount_afn' => null,
                'notes' => 'نگهداری موقت',
                'created_at' => '۱۴۰۳/۰۶/۱۰',
            ],
            [
                'id' => 4,
                'type' => 'buy',
                'type_label' => 'خرید طلا',
                'weight_tola' => 1.0,
                'ayar' => 18,
                'amount_usd' => 950.00,
                'amount_afn' => 65550.00,
                'notes' => '',
                'created_at' => '۱۴۰۳/۰۵/۰۵',
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('customers/index', [
            'customers' => $this->mockCustomers(),
        ]);
    }

    public function create()
    {
        return Inertia::render('customers/create');
    }

    public function show(string $id)
    {
        $customers = $this->mockCustomers();
        $customer = collect($customers)->firstWhere('id', (int) $id) ?? $customers[0];

        return Inertia::render('customers/show', [
            'customer' => $customer,
            'transactions' => $this->mockTransactions(),
        ]);
    }

    public function edit(string $id)
    {
        $customers = $this->mockCustomers();
        $customer = collect($customers)->firstWhere('id', (int) $id) ?? $customers[0];

        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }
}
