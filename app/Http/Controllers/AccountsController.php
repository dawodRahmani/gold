<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AccountsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('accounts', [
            'balances' => $this->mockBalances(),
            'ledgers'  => $this->mockLedgers(),
        ]);
    }

    private function mockBalances(): array
    {
        return [
            'usd'   => 24_850.00,
            'afn'   => 1_739_500.00,
            'pasa'  => 38.25,   // tola, 24 ayar
            'gold'  => 12.75,   // tola, variable ayar
        ];
    }

    private function mockLedgers(): array
    {
        return [
            'usd' => [
                ['id' => 1,  'date' => '۱۴۰۳/۱۰/۰۱', 'description' => 'موجودی اول دوره',             'debit' => 0,       'credit' => 20000.00, 'balance' => 20000.00],
                ['id' => 2,  'date' => '۱۴۰۳/۱۰/۰۵', 'description' => 'فروش طلا — احمد شاه',         'debit' => 0,       'credit' => 1800.00,  'balance' => 21800.00],
                ['id' => 3,  'date' => '۱۴۰۳/۱۰/۰۸', 'description' => 'خرید طلا — محمد ظاهر',        'debit' => 950.00,  'credit' => 0,        'balance' => 20850.00],
                ['id' => 4,  'date' => '۱۴۰۳/۱۰/۱۲', 'description' => 'فروش طلا — فاطمه نوری',       'debit' => 0,       'credit' => 1050.00,  'balance' => 21900.00],
                ['id' => 5,  'date' => '۱۴۰۳/۱۰/۱۵', 'description' => 'خرید طلا — احمد خان',         'debit' => 3200.00, 'credit' => 0,        'balance' => 18700.00],
                ['id' => 6,  'date' => '۱۴۰۳/۱۰/۲۰', 'description' => 'فروش طلا — زینب احمدی',       'debit' => 0,       'credit' => 2400.00,  'balance' => 21100.00],
                ['id' => 7,  'date' => '۱۴۰۳/۱۰/۲۵', 'description' => 'خرید پاسا — عبدالرحیم',       'debit' => 1500.00, 'credit' => 0,        'balance' => 19600.00],
                ['id' => 8,  'date' => '۱۴۰۳/۱۰/۲۸', 'description' => 'فروش طلا — محمد حسین',        'debit' => 0,       'credit' => 5250.00,  'balance' => 24850.00],
            ],
            'afn' => [
                ['id' => 1,  'date' => '۱۴۰۳/۱۰/۰۱', 'description' => 'موجودی اول دوره',             'debit' => 0,          'credit' => 1_400_000, 'balance' => 1_400_000],
                ['id' => 2,  'date' => '۱۴۰۳/۱۰/۰۵', 'description' => 'فروش طلا — احمد شاه',         'debit' => 0,          'credit' => 124_200,   'balance' => 1_524_200],
                ['id' => 3,  'date' => '۱۴۰۳/۱۰/۰۸', 'description' => 'خرید طلا — محمد ظاهر',        'debit' => 66_500,     'credit' => 0,         'balance' => 1_457_700],
                ['id' => 4,  'date' => '۱۴۰۳/۱۰/۱۲', 'description' => 'فروش طلا — فاطمه نوری',       'debit' => 0,          'credit' => 72_450,    'balance' => 1_530_150],
                ['id' => 5,  'date' => '۱۴۰۳/۱۰/۱۸', 'description' => 'خرید طلا — نور محمد',         'debit' => 56_000,     'credit' => 0,         'balance' => 1_474_150],
                ['id' => 6,  'date' => '۱۴۰۳/۱۰/۲۵', 'description' => 'فروش طلا — ملیحه صادقی',      'debit' => 0,          'credit' => 350_000,   'balance' => 1_824_150],
                ['id' => 7,  'date' => '۱۴۰۳/۱۰/۲۸', 'description' => 'خرید طلا — عبدالرحیم',        'debit' => 84_650,     'credit' => 0,         'balance' => 1_739_500],
            ],
            'pasa' => [
                ['id' => 1,  'date' => '۱۴۰۳/۱۰/۰۱', 'description' => 'موجودی اول دوره',             'debit' => 0,     'credit' => 30.00,  'balance' => 30.00],
                ['id' => 2,  'date' => '۱۴۰۳/۱۰/۰۵', 'description' => 'خرید پاسا — احمد شاه',        'debit' => 1.50,  'credit' => 0,      'balance' => 28.50],
                ['id' => 3,  'date' => '۱۴۰۳/۱۰/۰۸', 'description' => 'فروش پاسا — محمد ظاهر',       'debit' => 0,     'credit' => 2.00,   'balance' => 30.50],
                ['id' => 4,  'date' => '۱۴۰۳/۱۰/۱۵', 'description' => 'انتقال پاسا به فروشگاه',      'debit' => 0,     'credit' => 5.00,   'balance' => 35.50],
                ['id' => 5,  'date' => '۱۴۰۳/۱۰/۲۰', 'description' => 'فروش پاسا — فاطمه نوری',      'debit' => 0.75,  'credit' => 0,      'balance' => 34.75],
                ['id' => 6,  'date' => '۱۴۰۳/۱۰/۲۸', 'description' => 'خرید پاسا — عبدالرحیم خان',  'debit' => 0,     'credit' => 3.50,   'balance' => 38.25],
            ],
            'gold' => [
                ['id' => 1,  'date' => '۱۴۰۳/۱۰/۰۱', 'description' => 'موجودی اول دوره',             'debit' => 0,    'credit' => 8.00,  'balance' => 8.00],
                ['id' => 2,  'date' => '۱۴۰۳/۱۰/۰۵', 'description' => 'خرید طلا ۲۲ عیار — احمد',     'debit' => 0,    'credit' => 2.50,  'balance' => 10.50],
                ['id' => 3,  'date' => '۱۴۰۳/۱۰/۱۲', 'description' => 'فروش طلا ۱۸ عیار',            'debit' => 1.00, 'credit' => 0,     'balance' => 9.50],
                ['id' => 4,  'date' => '۱۴۰۳/۱۰/۱۸', 'description' => 'خرید طلا ۲۱ عیار — زینب',    'debit' => 0,    'credit' => 4.50,  'balance' => 14.00],
                ['id' => 5,  'date' => '۱۴۰۳/۱۰/۲۵', 'description' => 'فروش طلا ۲۲ عیار',            'debit' => 1.25, 'credit' => 0,     'balance' => 12.75],
            ],
        ];
    }
}
