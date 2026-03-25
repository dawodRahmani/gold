<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    private function mockSuppliers(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'احمد خان',
                'phone' => '0700000001',
                'whatsapp' => '0700000001',
                'city' => 'کابل',
                'pasa_balance' => 15.5,
                'usd_balance' => 3200.00,
                'afn_balance' => 224000,
            ],
            [
                'id' => 2,
                'name' => 'محمد ظاهر',
                'phone' => '0700000002',
                'whatsapp' => '0700000002',
                'city' => 'مزار شریف',
                'pasa_balance' => 8.2,
                'usd_balance' => 1500.00,
                'afn_balance' => 105000,
            ],
            [
                'id' => 3,
                'name' => 'عبدالرحیم',
                'phone' => '0700000003',
                'whatsapp' => '0700000003',
                'city' => 'هرات',
                'pasa_balance' => 22.0,
                'usd_balance' => 5000.00,
                'afn_balance' => 350000,
            ],
            [
                'id' => 4,
                'name' => 'نور محمد',
                'phone' => '0700000004',
                'whatsapp' => '0700000004',
                'city' => 'کابل',
                'pasa_balance' => 0.0,
                'usd_balance' => 800.00,
                'afn_balance' => 56000,
            ],
        ];
    }

    private function mockTransactions(): array
    {
        return [
            ['id' => 1, 'date' => '۱۴۰۳/۱۰/۰۵', 'type' => 'خرید', 'amount_tola' => 2.5, 'usd' => 480, 'afn' => 33600, 'status' => 'تکمیل'],
            ['id' => 2, 'date' => '۱۴۰۳/۱۰/۱۲', 'type' => 'فروش', 'amount_tola' => 1.0, 'usd' => 190, 'afn' => 13300, 'status' => 'تکمیل'],
            ['id' => 3, 'date' => '۱۴۰۳/۱۰/۱۸', 'type' => 'خرید', 'amount_tola' => 5.0, 'usd' => 950, 'afn' => 66500, 'status' => 'در انتظار'],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('suppliers/index', [
            'suppliers' => $this->mockSuppliers(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('suppliers/create', [
            'supplier' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Mock store — no DB yet
        return redirect()->route('suppliers.index');
    }

    public function show(string $id): Response
    {
        $suppliers = $this->mockSuppliers();
        $supplier = collect($suppliers)->firstWhere('id', (int) $id) ?? $suppliers[0];

        return Inertia::render('suppliers/show', [
            'supplier' => $supplier,
            'transactions' => $this->mockTransactions(),
        ]);
    }

    public function edit(string $id): Response
    {
        $suppliers = $this->mockSuppliers();
        $supplier = collect($suppliers)->firstWhere('id', (int) $id) ?? $suppliers[0];

        return Inertia::render('suppliers/create', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        // Mock update — no DB yet
        return redirect()->route('suppliers.show', $id);
    }

    public function destroy(string $id): RedirectResponse
    {
        // Mock destroy — no DB yet
        return redirect()->route('suppliers.index');
    }
}
