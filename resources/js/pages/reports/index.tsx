import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { BarChart3, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'گزارشات', href: '/reports' },
];

// ── Report types ────────────────────────────────────────────────────

type ReportType =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'customer_statement'
    | 'supplier_statement'
    | 'gold_inventory'
    | 'trust_gold'
    | 'profit_loss'
    | 'exchange_rates';

type ReportMeta = {
    type: ReportType;
    emoji: string;
    label: string;
    desc: string;
    needsCustomer?: boolean;
    needsSupplier?: boolean;
    needsDateRange?: boolean;
};

const REPORTS: ReportMeta[] = [
    { type: 'daily',              emoji: '📅', label: 'گزارش روزانه',     desc: 'خلاصه تراکنش‌های روز',        needsDateRange: true },
    { type: 'weekly',             emoji: '📆', label: 'گزارش هفتگی',      desc: 'خلاصه هفتگی معاملات',        needsDateRange: true },
    { type: 'monthly',            emoji: '🗓', label: 'گزارش ماهانه',     desc: 'خلاصه ماهانه معاملات',       needsDateRange: true },
    { type: 'customer_statement', emoji: '👤', label: 'کارت مشتری',       desc: 'صورت حساب کامل مشتری',       needsCustomer: true, needsDateRange: true },
    { type: 'supplier_statement', emoji: '🏢', label: 'کارت سپلایر',      desc: 'صورت حساب کامل سپلایر',      needsSupplier: true, needsDateRange: true },
    { type: 'gold_inventory',     emoji: '🥇', label: 'موجودی طلا',       desc: 'موجودی کامل بر اساس عیار',   needsDateRange: false },
    { type: 'trust_gold',         emoji: '🔒', label: 'طلای امانتی',      desc: 'لیست همه امانات فعال',       needsDateRange: false },
    { type: 'profit_loss',        emoji: '📈', label: 'سود و زیان',       desc: 'گزارش درآمد و هزینه',        needsDateRange: true },
    { type: 'exchange_rates',     emoji: '💱', label: 'نرخ ارز',          desc: 'تاریخچه نرخ‌های ارز',        needsDateRange: true },
];

// ── Mock data ───────────────────────────────────────────────────────

const mockDailySummary = [
    { date: '۱۴۰۳/۱۰/۰۵', buy_count: 2, sell_count: 1, buy_tola: 3.5,  sell_tola: 1.0, net_usd:  608,  net_afn:  42560 },
    { date: '۱۴۰۳/۱۰/۰۶', buy_count: 0, sell_count: 2, buy_tola: 0,    sell_tola: 2.5, net_usd: -475,  net_afn: -33250 },
    { date: '۱۴۰۳/۱۰/۰۸', buy_count: 1, sell_count: 0, buy_tola: 2.0,  sell_tola: 0,   net_usd:  380,  net_afn:  26600 },
    { date: '۱۴۰۳/۱۰/۱۲', buy_count: 0, sell_count: 1, buy_tola: 0,    sell_tola: 1.5, net_usd: -285,  net_afn: -19950 },
    { date: '۱۴۰۳/۱۰/۱۵', buy_count: 3, sell_count: 1, buy_tola: 12.0, sell_tola: 0.5, net_usd: 2185, net_afn: 152950 },
];

const mockCustomerStatement = {
    customer: { name: 'احمد شاه', phone: '0799123456', city: 'کابل', type: 'دایمی' },
    transactions: [
        { date: '۱۴۰۳/۱۰/۰۵', type: 'خرید',   weight: 2.5, ayar: 21, debit_usd:  475, credit_usd: null, balance_usd: -475 },
        { date: '۱۴۰۳/۱۰/۱۵', type: 'فروش',   weight: 1.0, ayar: 18, debit_usd: null, credit_usd:  162, balance_usd: -313 },
        { date: '۱۴۰۳/۱۰/۲۰', type: 'خرید',   weight: 3.0, ayar: 24, debit_usd:  570, credit_usd: null, balance_usd: -883 },
        { date: '۱۴۰۳/۱۰/۲۵', type: 'پرداخت', weight: null,ayar: null,debit_usd: null, credit_usd:  500, balance_usd: -383 },
    ],
    closing_balance: { pasa: 4.5, gold: 1.0, usd: -383, afn: 0 },
};

const mockSupplierStatement = {
    supplier: { name: 'احمد خان', phone: '0700000001', city: 'کابل' },
    transactions: [
        { date: '۱۴۰۳/۱۰/۰۲', type: 'تحویل',  weight: 10.0, ayar: 24, debit_usd: 1900, credit_usd: null, balance_usd: -1900 },
        { date: '۱۴۰۳/۱۰/۱۰', type: 'پرداخت', weight: null,  ayar: null,debit_usd: null, credit_usd: 1000, balance_usd:  -900 },
        { date: '۱۴۰۳/۱۰/۲۰', type: 'تحویل',  weight: 5.0,  ayar: 24, debit_usd:  950, credit_usd: null, balance_usd: -1850 },
    ],
    closing_balance: { pasa: 15.0, usd: -1850, afn: 0 },
};

const mockGoldInventory = [
    { category: 'پاسا (۲۴ عیار)',    tola: 28.5, gram: 346.28, equiv24: 28.50 },
    { category: 'طلای ۲۳.۷۷ عیار',  tola:  5.0, gram:  60.75, equiv24:  4.95 },
    { category: 'طلای ۲۲ عیار',      tola:  8.0, gram:  97.20, equiv24:  7.33 },
    { category: 'طلای ۲۱ عیار',      tola: 12.5, gram: 151.88, equiv24: 10.94 },
    { category: 'طلای ۱۸ عیار',      tola:  3.0, gram:  36.45, equiv24:  2.25 },
];

const mockTrustGold = [
    { customer: 'احمد شاه',       phone: '0799123456', weight: 3.0, ayar: 24, since: '۱۴۰۳/۰۹/۱۵', notes: 'امانت دایمی' },
    { customer: 'عبدالله کریمی', phone: '0798765432', weight: 3.0, ayar: 24, since: '۱۴۰۳/۱۰/۱۲', notes: 'امانت موقت تا پایان ماه' },
    { customer: 'فاطمه احمدی',   phone: '0791234567', weight: 2.5, ayar: 22, since: '۱۴۰۳/۱۰/۰۱', notes: null },
];

const mockProfitLoss = [
    { period: 'دهه اول',  revenue_usd: 2280, cost_usd: 1900, profit_usd:  380, margin: '16.7%' },
    { period: 'دهه دوم',  revenue_usd: 3420, cost_usd: 2850, profit_usd:  570, margin: '16.7%' },
    { period: 'دهه سوم',  revenue_usd: 1710, cost_usd: 1425, profit_usd:  285, margin: '16.7%' },
];

const mockExchangeRates = [
    { date: '۱۴۰۳/۱۰/۰۱', usd_to_afn: 70.0, eur_to_afn: 76.5, tola_usd: 190.0 },
    { date: '۱۴۰۳/۱۰/۰۵', usd_to_afn: 70.5, eur_to_afn: 77.0, tola_usd: 191.0 },
    { date: '۱۴۰۳/۱۰/۱۰', usd_to_afn: 70.0, eur_to_afn: 76.8, tola_usd: 190.5 },
    { date: '۱۴۰۳/۱۰/۱۵', usd_to_afn: 71.0, eur_to_afn: 77.5, tola_usd: 192.0 },
    { date: '۱۴۰۳/۱۰/۲۰', usd_to_afn: 70.5, eur_to_afn: 77.0, tola_usd: 191.5 },
    { date: '۱۴۰۳/۱۰/۲۵', usd_to_afn: 70.0, eur_to_afn: 76.5, tola_usd: 190.0 },
];

// ── Table helpers ───────────────────────────────────────────────────

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
    return (
        <th className={cn('px-4 py-3 text-xs font-semibold text-muted-foreground', right ? 'text-end' : 'text-start')}>
            {children}
        </th>
    );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
    return <td className={cn('px-4 py-3 text-sm', className)}>{children}</td>;
}

function ReportTable({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">{children}</table>
        </div>
    );
}

function TotalsRow({ children }: { children: React.ReactNode }) {
    return (
        <tr className="border-t-2 border-border bg-muted/30 font-semibold text-sm">
            {children}
        </tr>
    );
}

function SummaryCard({
    label, value, sub, color, bg,
}: { label: string; value: string; sub?: string; color: string; bg: string }) {
    return (
        <div className={cn('rounded-xl border p-4 text-center space-y-1', bg)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn('text-xl font-bold tabular-nums', color)}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

// ── Report previews ─────────────────────────────────────────────────

function DailyPreview({ type }: { type: 'daily' | 'weekly' | 'monthly' }) {
    const label = type === 'daily' ? 'تاریخ' : type === 'weekly' ? 'هفته' : 'ماه';
    const totalBuy  = mockDailySummary.reduce((s, r) => s + r.buy_tola, 0);
    const totalSell = mockDailySummary.reduce((s, r) => s + r.sell_tola, 0);
    const totalNet  = mockDailySummary.reduce((s, r) => s + r.net_usd, 0);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard label="مجموع خرید" value={`${totalBuy} تولا`} color="text-green-600" bg="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" />
                <SummaryCard label="مجموع فروش" value={`${totalSell} تولا`} color="text-red-500" bg="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" />
                <SummaryCard label="خالص دالر"  value={`$${totalNet.toLocaleString()}`} color="text-primary" bg="bg-primary/5 border-primary/20" />
            </div>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>{label}</Th>
                        <Th>تعداد خرید</Th>
                        <Th>تعداد فروش</Th>
                        <Th>خرید (تولا)</Th>
                        <Th>فروش (تولا)</Th>
                        <Th>خالص ($)</Th>
                        <Th>خالص (؋)</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {mockDailySummary.map((row) => (
                        <tr key={row.date} className="hover:bg-muted/5">
                            <Td className="tabular-nums font-medium">{row.date}</Td>
                            <Td className="tabular-nums text-green-600">{row.buy_count || '—'}</Td>
                            <Td className="tabular-nums text-red-500">{row.sell_count || '—'}</Td>
                            <Td className="tabular-nums">{row.buy_tola > 0 ? row.buy_tola : '—'}</Td>
                            <Td className="tabular-nums">{row.sell_tola > 0 ? row.sell_tola : '—'}</Td>
                            <Td className={cn('tabular-nums font-medium', row.net_usd >= 0 ? 'text-green-600' : 'text-red-500')}>
                                {row.net_usd >= 0 ? '+' : ''}${row.net_usd.toLocaleString()}
                            </Td>
                            <Td className={cn('tabular-nums', row.net_afn >= 0 ? 'text-green-600' : 'text-red-500')}>
                                {row.net_afn >= 0 ? '+' : ''}{row.net_afn.toLocaleString()} ؋
                            </Td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <TotalsRow>
                        <Td>جمع کل</Td>
                        <Td className="tabular-nums text-green-600">{mockDailySummary.reduce((s, r) => s + r.buy_count, 0)}</Td>
                        <Td className="tabular-nums text-red-500">{mockDailySummary.reduce((s, r) => s + r.sell_count, 0)}</Td>
                        <Td className="tabular-nums">{totalBuy}</Td>
                        <Td className="tabular-nums">{totalSell}</Td>
                        <Td className="tabular-nums text-green-600">+${totalNet.toLocaleString()}</Td>
                        <Td className="tabular-nums text-green-600">+{mockDailySummary.reduce((s, r) => s + r.net_afn, 0).toLocaleString()} ؋</Td>
                    </TotalsRow>
                </tfoot>
            </ReportTable>
        </div>
    );
}

function CustomerStatementPreview() {
    const { customer, transactions, closing_balance } = mockCustomerStatement;
    return (
        <div className="space-y-5">
            {/* Customer header card */}
            <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{customer.phone} · {customer.city}</p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {customer.type}
                </span>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SummaryCard label="موجودی پاسا"   value={`${closing_balance.pasa} تولا`}   sub="۲۴ عیار"  color="text-amber-600" bg="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" />
                <SummaryCard label="موجودی طلا"    value={`${closing_balance.gold} تولا`}   color="text-yellow-600" bg="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" />
                <SummaryCard label="موجودی دالر"   value={closing_balance.usd < 0 ? `$${Math.abs(closing_balance.usd)}` : `+$${closing_balance.usd}`} color={closing_balance.usd < 0 ? 'text-red-500' : 'text-green-600'} bg="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" />
                <SummaryCard label="موجودی افغانی" value={`${closing_balance.afn} ؋`}       color="text-blue-600"  bg="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" />
            </div>

            {/* Ledger */}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">دفتر معاملات</p>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>تاریخ</Th>
                        <Th>نوع</Th>
                        <Th>وزن (تولا)</Th>
                        <Th>عیار</Th>
                        <Th right>بدهکار ($)</Th>
                        <Th right>بستانکار ($)</Th>
                        <Th right>مانده ($)</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-muted/5">
                            <Td className="tabular-nums">{tx.date}</Td>
                            <Td className="font-medium">{tx.type}</Td>
                            <Td className="tabular-nums">{tx.weight ?? '—'}</Td>
                            <Td className="tabular-nums text-muted-foreground">{tx.ayar ? `${tx.ayar}` : '—'}</Td>
                            <Td className="tabular-nums text-end text-red-500">{tx.debit_usd  ? `$${tx.debit_usd}`  : '—'}</Td>
                            <Td className="tabular-nums text-end text-green-600">{tx.credit_usd ? `$${tx.credit_usd}` : '—'}</Td>
                            <Td className={cn('tabular-nums text-end font-medium', tx.balance_usd < 0 ? 'text-red-500' : 'text-green-600')}>
                                {tx.balance_usd < 0 ? `-$${Math.abs(tx.balance_usd)}` : `+$${tx.balance_usd}`}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </ReportTable>
        </div>
    );
}

function SupplierStatementPreview() {
    const { supplier, transactions, closing_balance } = mockSupplierStatement;
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    {supplier.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{supplier.phone} · {supplier.city}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <SummaryCard label="موجودی پاسا"   value={`${closing_balance.pasa} تولا`} sub="۲۴ عیار" color="text-amber-600" bg="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" />
                <SummaryCard label="موجودی دالر"   value={closing_balance.usd < 0 ? `-$${Math.abs(closing_balance.usd)}` : `+$${closing_balance.usd}`} color={closing_balance.usd < 0 ? 'text-red-500' : 'text-green-600'} bg="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" />
                <SummaryCard label="موجودی افغانی" value={`${closing_balance.afn} ؋`} color="text-blue-600" bg="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">دفتر معاملات</p>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>تاریخ</Th>
                        <Th>نوع</Th>
                        <Th>وزن (تولا)</Th>
                        <Th right>بدهکار ($)</Th>
                        <Th right>بستانکار ($)</Th>
                        <Th right>مانده ($)</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-muted/5">
                            <Td className="tabular-nums">{tx.date}</Td>
                            <Td className="font-medium">{tx.type}</Td>
                            <Td className="tabular-nums">{tx.weight ?? '—'}</Td>
                            <Td className="tabular-nums text-end text-red-500">{tx.debit_usd  ? `$${tx.debit_usd}`  : '—'}</Td>
                            <Td className="tabular-nums text-end text-green-600">{tx.credit_usd ? `$${tx.credit_usd}` : '—'}</Td>
                            <Td className={cn('tabular-nums text-end font-medium', tx.balance_usd < 0 ? 'text-red-500' : 'text-green-600')}>
                                {tx.balance_usd < 0 ? `-$${Math.abs(tx.balance_usd)}` : `+$${tx.balance_usd}`}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </ReportTable>
        </div>
    );
}

function GoldInventoryPreview() {
    const total24 = mockGoldInventory.reduce((s, r) => s + r.equiv24, 0);
    const totalTola = mockGoldInventory.reduce((s, r) => s + r.tola, 0);
    const totalGram = mockGoldInventory.reduce((s, r) => s + r.gram, 0);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard label="مجموع تولا (خام)"    value={`${totalTola.toFixed(2)} تولا`} color="text-amber-600" bg="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" />
                <SummaryCard label="مجموع گرام (خام)"    value={`${totalGram.toFixed(2)} گرام`} color="text-yellow-600" bg="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" />
                <SummaryCard label="معادل ۲۴ عیار"        value={`${total24.toFixed(2)} تولا`}   sub="پاسا خالص" color="text-primary"    bg="bg-primary/5 border-primary/20" />
            </div>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>دسته‌بندی</Th>
                        <Th right>مقدار (تولا)</Th>
                        <Th right>مقدار (گرام)</Th>
                        <Th right>معادل ۲۴ عیار</Th>
                        <Th right>درصد</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {mockGoldInventory.map((row) => (
                        <tr key={row.category} className="hover:bg-muted/5">
                            <Td className="font-medium">{row.category}</Td>
                            <Td className="tabular-nums text-end">{row.tola.toFixed(2)}</Td>
                            <Td className="tabular-nums text-end text-muted-foreground">{row.gram.toFixed(2)}</Td>
                            <Td className="tabular-nums text-end font-semibold text-amber-600">{row.equiv24.toFixed(2)}</Td>
                            <Td className="tabular-nums text-end text-muted-foreground">
                                {((row.equiv24 / total24) * 100).toFixed(1)}%
                            </Td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <TotalsRow>
                        <Td>مجموع</Td>
                        <Td className="tabular-nums text-end">{totalTola.toFixed(2)}</Td>
                        <Td className="tabular-nums text-end">{totalGram.toFixed(2)}</Td>
                        <Td className="tabular-nums text-end text-amber-600">{total24.toFixed(2)}</Td>
                        <Td className="text-end">100%</Td>
                    </TotalsRow>
                </tfoot>
            </ReportTable>
        </div>
    );
}

function TrustGoldPreview() {
    const total = mockTrustGold.reduce((s, r) => s + r.weight, 0);
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <SummaryCard label="مجموع امانات" value={`${total} تولا`} sub={`${mockTrustGold.length} مشتری`} color="text-blue-600" bg="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" />
                <SummaryCard label="امانات ۲۴ عیار" value={`${mockTrustGold.filter(r => r.ayar === 24).reduce((s, r) => s + r.weight, 0)} تولا`} color="text-primary" bg="bg-primary/5 border-primary/20" />
            </div>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>مشتری</Th>
                        <Th>شماره تلفن</Th>
                        <Th right>مقدار (تولا)</Th>
                        <Th>عیار</Th>
                        <Th>از تاریخ</Th>
                        <Th>یادداشت</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {mockTrustGold.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/5">
                            <Td className="font-medium">{row.customer}</Td>
                            <Td className="tabular-nums text-muted-foreground" dir="ltr">{row.phone}</Td>
                            <Td className="tabular-nums text-end font-semibold text-blue-600">{row.weight}</Td>
                            <Td className="tabular-nums text-muted-foreground">{row.ayar} عیار</Td>
                            <Td className="tabular-nums text-muted-foreground">{row.since}</Td>
                            <Td className="text-muted-foreground text-xs">{row.notes || '—'}</Td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <TotalsRow>
                        <Td>مجموع</Td>
                        <Td />
                        <Td className="tabular-nums text-end text-blue-600">{total}</Td>
                        <Td /><Td /><Td />
                    </TotalsRow>
                </tfoot>
            </ReportTable>
        </div>
    );
}

function ProfitLossPreview() {
    const rev  = mockProfitLoss.reduce((s, r) => s + r.revenue_usd, 0);
    const cost = mockProfitLoss.reduce((s, r) => s + r.cost_usd,    0);
    const prof = mockProfitLoss.reduce((s, r) => s + r.profit_usd,  0);
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard label="مجموع درآمد" value={`$${rev.toLocaleString()}`}  color="text-green-600" bg="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" />
                <SummaryCard label="مجموع هزینه" value={`$${cost.toLocaleString()}`} color="text-red-500"   bg="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" />
                <SummaryCard label="سود خالص"    value={`$${prof.toLocaleString()}`} sub="16.7% حاشیه" color="text-primary"    bg="bg-primary/5 border-primary/20" />
            </div>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>دوره</Th>
                        <Th right>درآمد ($)</Th>
                        <Th right>هزینه ($)</Th>
                        <Th right>سود ($)</Th>
                        <Th right>حاشیه</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {mockProfitLoss.map((row) => (
                        <tr key={row.period} className="hover:bg-muted/5">
                            <Td className="font-medium">{row.period}</Td>
                            <Td className="tabular-nums text-end text-green-600">${row.revenue_usd.toLocaleString()}</Td>
                            <Td className="tabular-nums text-end text-red-500">${row.cost_usd.toLocaleString()}</Td>
                            <Td className="tabular-nums text-end font-semibold text-primary">${row.profit_usd.toLocaleString()}</Td>
                            <Td className="tabular-nums text-end text-muted-foreground">{row.margin}</Td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <TotalsRow>
                        <Td>جمع کل</Td>
                        <Td className="tabular-nums text-end text-green-600">${rev.toLocaleString()}</Td>
                        <Td className="tabular-nums text-end text-red-500">${cost.toLocaleString()}</Td>
                        <Td className="tabular-nums text-end text-primary">${prof.toLocaleString()}</Td>
                        <Td className="tabular-nums text-end text-muted-foreground">16.7%</Td>
                    </TotalsRow>
                </tfoot>
            </ReportTable>
        </div>
    );
}

function ExchangeRatesPreview() {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
                <SummaryCard label="نرخ فعلی دالر"   value={`${mockExchangeRates.at(-1)!.usd_to_afn} ؋`}   color="text-green-600" bg="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" />
                <SummaryCard label="نرخ فعلی یورو"   value={`${mockExchangeRates.at(-1)!.eur_to_afn} ؋`}   color="text-blue-600"  bg="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" />
                <SummaryCard label="نرخ فعلی تولا"   value={`$${mockExchangeRates.at(-1)!.tola_usd}`}        sub="هر تولا" color="text-amber-600" bg="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" />
            </div>
            <ReportTable>
                <thead>
                    <tr className="border-b bg-muted/10">
                        <Th>تاریخ</Th>
                        <Th right>دالر به افغانی</Th>
                        <Th right>یورو به افغانی</Th>
                        <Th right>نرخ تولا (USD)</Th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {mockExchangeRates.map((row) => (
                        <tr key={row.date} className="hover:bg-muted/5">
                            <Td className="tabular-nums font-medium">{row.date}</Td>
                            <Td className="tabular-nums text-end">{row.usd_to_afn} ؋</Td>
                            <Td className="tabular-nums text-end">{row.eur_to_afn} ؋</Td>
                            <Td className="tabular-nums text-end font-semibold text-amber-600">${row.tola_usd}</Td>
                        </tr>
                    ))}
                </tbody>
            </ReportTable>
        </div>
    );
}

function ReportContent({ type }: { type: ReportType }) {
    if (type === 'daily' || type === 'weekly' || type === 'monthly') return <DailyPreview type={type} />;
    if (type === 'customer_statement')  return <CustomerStatementPreview />;
    if (type === 'supplier_statement')  return <SupplierStatementPreview />;
    if (type === 'gold_inventory')      return <GoldInventoryPreview />;
    if (type === 'trust_gold')          return <TrustGoldPreview />;
    if (type === 'profit_loss')         return <ProfitLossPreview />;
    if (type === 'exchange_rates')      return <ExchangeRatesPreview />;
    return null;
}

// ── Main page ───────────────────────────────────────────────────────

type Props = {
    customers: { id: number; name: string }[];
    suppliers: { id: number; name: string }[];
};

export default function ReportsIndex({ customers, suppliers }: Props) {
    const [selected, setSelected]   = useState<ReportType | null>(null);
    const [dateFrom, setDateFrom]   = useState('');
    const [dateTo, setDateTo]       = useState('');
    const [customerId, setCustomerId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const meta = selected ? REPORTS.find((r) => r.type === selected) : null;

    function pick(type: ReportType) {
        setSelected(type);
        setShowPreview(false);
        setCustomerId('');
        setSupplierId('');
    }

    const canGenerate = (() => {
        if (!selected) return false;
        if (meta?.needsCustomer && !customerId) return false;
        if (meta?.needsSupplier && !supplierId) return false;
        return true;
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="گزارشات" />

            {/* Full-height two-panel layout */}
            <div className="flex h-full min-h-0">

                {/* ── Left sidebar ── */}
                <div className="flex w-72 shrink-0 flex-col border-l border-border">

                    {/* Sidebar header */}
                    <div className="border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">نوع گزارش</span>
                        </div>
                    </div>

                    {/* Report type list */}
                    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        {REPORTS.map((r) => (
                            <button
                                key={r.type}
                                onClick={() => pick(r.type)}
                                className={cn(
                                    'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors',
                                    selected === r.type
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground hover:bg-muted/60',
                                )}
                            >
                                <span className="text-lg leading-none">{r.emoji}</span>
                                <div className="min-w-0">
                                    <p className={cn('text-sm font-medium truncate', selected === r.type && 'text-primary')}>
                                        {r.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{r.desc}</p>
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Filter section */}
                    {meta && (
                        <div className="border-t border-border p-4 space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">فیلترها</p>

                            {meta.needsCustomer && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium">مشتری</label>
                                    <select
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">-- انتخاب کنید --</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={String(c.id)}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {meta.needsSupplier && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium">سپلایر</label>
                                    <select
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">-- انتخاب کنید --</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={String(s.id)}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {meta.needsDateRange !== false && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium">از تاریخ</label>
                                        <input
                                            type="text"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            placeholder="۱۴۰۳/۱۰/۰۱"
                                            dir="ltr"
                                            className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium">تا تاریخ</label>
                                        <input
                                            type="text"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            placeholder="۱۴۰۳/۱۰/۳۰"
                                            dir="ltr"
                                            className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                disabled={!canGenerate}
                                className={cn(
                                    'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                    canGenerate
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed',
                                )}
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                نمایش گزارش
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Right content panel ── */}
                <div className="flex min-w-0 flex-1 flex-col">

                    {/* Empty state — nothing selected */}
                    {!selected && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-12">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-3xl">
                                📊
                            </div>
                            <p className="font-medium">گزارشی انتخاب نشده</p>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                از منوی سمت چپ نوع گزارش مورد نظر را انتخاب کنید
                            </p>
                        </div>
                    )}

                    {/* Selected but not generated yet */}
                    {selected && !showPreview && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-12">
                            <div className="text-5xl">{meta?.emoji}</div>
                            <p className="font-semibold text-lg">{meta?.label}</p>
                            <p className="text-sm text-muted-foreground">{meta?.desc}</p>
                            {(meta?.needsCustomer && !customerId) || (meta?.needsSupplier && !supplierId) ? (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                    {meta?.needsCustomer ? 'ابتدا یک مشتری انتخاب کنید' : 'ابتدا یک سپلایر انتخاب کنید'}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(true)}
                                    className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    نمایش گزارش
                                </button>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {selected && showPreview && (
                        <div className="flex flex-col flex-1 min-h-0">
                            {/* Preview toolbar */}
                            <div className="flex items-center justify-between border-b border-border bg-muted/10 px-5 py-2.5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{meta?.emoji}</span>
                                    <span className="font-semibold text-sm">{meta?.label}</span>
                                    {(dateFrom || dateTo) && (
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground" dir="ltr">
                                            {[dateFrom, dateTo].filter(Boolean).join(' — ')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(false)}
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/60 transition-colors"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        تغییر فیلتر
                                    </button>
                                    <button
                                        type="button"
                                        disabled
                                        title="به زودی"
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-40 cursor-not-allowed"
                                    >
                                        <FileText className="h-3 w-3" />
                                        PDF
                                    </button>
                                    <button
                                        type="button"
                                        disabled
                                        title="به زودی"
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-40 cursor-not-allowed"
                                    >
                                        <FileSpreadsheet className="h-3 w-3" />
                                        Excel
                                    </button>
                                </div>
                            </div>

                            {/* Report body */}
                            <div className="flex-1 overflow-y-auto p-5">
                                <ReportContent type={selected} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
