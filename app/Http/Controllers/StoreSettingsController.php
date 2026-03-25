<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class StoreSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('store-settings', [
            'currentRates' => $this->mockCurrentRates(),
            'rateHistory'  => $this->mockRateHistory(),
            'users'        => $this->mockUsers(),
            'units'        => $this->mockUnits(),
        ]);
    }

    private function mockCurrentRates(): array
    {
        return [
            'usd_to_afn'  => 70.50,
            'eur_to_afn'  => 76.20,
            'tola_usd'    => 3850.00,
        ];
    }

    private function mockRateHistory(): array
    {
        return [
            ['id' => 1, 'date' => '۱۴۰۳/۱۰/۲۸', 'usd_to_afn' => 70.50, 'eur_to_afn' => 76.20, 'tola_usd' => 3850.00, 'set_by' => 'احمد'],
            ['id' => 2, 'date' => '۱۴۰۳/۱۰/۲۱', 'usd_to_afn' => 70.00, 'eur_to_afn' => 75.80, 'tola_usd' => 3820.00, 'set_by' => 'احمد'],
            ['id' => 3, 'date' => '۱۴۰۳/۱۰/۱۴', 'usd_to_afn' => 69.80, 'eur_to_afn' => 75.50, 'tola_usd' => 3800.00, 'set_by' => 'محمد'],
            ['id' => 4, 'date' => '۱۴۰۳/۱۰/۰۷', 'usd_to_afn' => 69.50, 'eur_to_afn' => 75.00, 'tola_usd' => 3780.00, 'set_by' => 'احمد'],
            ['id' => 5, 'date' => '۱۴۰۳/۰۹/۳۰', 'usd_to_afn' => 69.00, 'eur_to_afn' => 74.50, 'tola_usd' => 3750.00, 'set_by' => 'محمد'],
        ];
    }

    private function mockUsers(): array
    {
        return [
            ['id' => 1, 'name' => 'احمد رحمانی',   'email' => 'ahmad@gs.af',   'role' => 'admin',       'active' => true],
            ['id' => 2, 'name' => 'محمد نوری',     'email' => 'mohammad@gs.af','role' => 'accountant',  'active' => true],
            ['id' => 3, 'name' => 'فریده صادقی',   'email' => 'farida@gs.af',  'role' => 'viewer',      'active' => true],
            ['id' => 4, 'name' => 'حمید کریمی',    'email' => 'hamid@gs.af',   'role' => 'accountant',  'active' => false],
        ];
    }

    private function mockUnits(): array
    {
        return [
            'tola_grams'          => 12.15,        // 1 tola in grams
            'ayar_presets'        => [18, 21, 22, 23.77, 24],  // quick-select purity buttons
            'default_city'        => 'کابل',
            'default_weight_unit' => 'tola',       // 'tola' | 'gram'
            'shop_name'           => 'سیستم مدیریت طلا فروشی',
        ];
    }
}
