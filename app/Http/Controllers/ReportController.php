<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index', [
            'customers' => [
                ['id' => 1, 'name' => 'احمد شاه'],
                ['id' => 2, 'name' => 'مریم نوری'],
                ['id' => 3, 'name' => 'عبدالله کریمی'],
                ['id' => 4, 'name' => 'زرغونه میرزایی'],
                ['id' => 5, 'name' => 'حمید رحیمی'],
                ['id' => 6, 'name' => 'فاطمه احمدی'],
            ],
            'suppliers' => [
                ['id' => 1, 'name' => 'احمد خان'],
                ['id' => 2, 'name' => 'محمد ظاهر'],
                ['id' => 3, 'name' => 'عبدالرحیم'],
                ['id' => 4, 'name' => 'نور محمد'],
            ],
        ]);
    }
}
