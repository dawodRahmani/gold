import { Head } from '@inertiajs/react';
import { Landmark } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'حساب‌های فروشگاه', href: '/accounts' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface Balances {
    usd: number;
    afn: number;
    pasa: number;
    gold: number;
}

interface LedgerRow {
    id: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

type AccountKey = 'usd' | 'afn' | 'pasa' | 'gold';

interface Props {
    balances: Balances;
    ledgers: Record<AccountKey, LedgerRow[]>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fNum(n: number, decimals = 2): string {
    return n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function fTola(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// ─── Account config ───────────────────────────────────────────────────────────

const ACCOUNTS: {
    key: AccountKey;
    label: string;
    icon: string;
    unit: string;
    sub: string;
    color: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
    formatValue: (n: number) => string;
}[] = [
    {
        key: 'usd',
        label: 'دالر',
        icon: '💰',
        unit: '$',
        sub: 'دالر امریکایی',
        color: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-400',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/40',
        formatValue: (n) => `$${fNum(n)}`,
    },
    {
        key: 'afn',
        label: 'افغانی',
        icon: '💴',
        unit: '؋',
        sub: 'افغانی',
        color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/40',
        formatValue: (n) => `${fNum(n, 0)} ؋`,
    },
    {
        key: 'pasa',
        label: 'پاسا',
        icon: '⚜',
        unit: 'تولا',
        sub: '۲۴ عیار',
        color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
        textColor: 'text-amber-700 dark:text-amber-400',
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-100 dark:bg-amber-900/40',
        formatValue: (n) => `${fTola(n)} تولا`,
    },
    {
        key: 'gold',
        label: 'طلای عمومی',
        icon: '🥇',
        unit: 'تولا',
        sub: 'عیار متغیر',
        color: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
        textColor: 'text-orange-700 dark:text-orange-400',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/40',
        formatValue: (n) => `${fTola(n)} تولا`,
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AccountsPage({ balances, ledgers }: Props) {
    const [activeAccount, setActiveAccount] = useState<AccountKey>('usd');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const account = ACCOUNTS.find((a) => a.key === activeAccount)!;
    const rows = ledgers[activeAccount] ?? [];

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            if (dateFrom && row.date < dateFrom) return false;
            if (dateTo && row.date > dateTo) return false;
            return true;
        });
    }, [rows, dateFrom, dateTo]);

    const isTola = activeAccount === 'pasa' || activeAccount === 'gold';

    function formatCell(n: number): string {
        if (n === 0) return '—';
        return isTola ? fTola(n) : fNum(n);
    }

    function formatBalance(n: number): string {
        return isTola ? `${fTola(n)} تولا` : activeAccount === 'afn' ? `${fNum(n, 0)} ؋` : `$${fNum(n)}`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="حساب‌های فروشگاه" />
            <div className="flex flex-col gap-6 p-6">

                {/* Page header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Landmark className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">حساب‌های فروشگاه</h1>
                        <p className="text-xs text-muted-foreground">وضعیت کلی موجودی‌های فروشگاه</p>
                    </div>
                </div>

                {/* Balance cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {ACCOUNTS.map((acc) => (
                        <button
                            key={acc.key}
                            onClick={() => setActiveAccount(acc.key)}
                            className={cn(
                                'rounded-xl border p-5 flex items-center gap-4 text-start transition-all',
                                acc.color,
                                activeAccount === acc.key
                                    ? `ring-2 ring-offset-2 ring-offset-background ${acc.borderColor} shadow-md`
                                    : 'hover:shadow-sm',
                            )}
                        >
                            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0', acc.bgColor)}>
                                {acc.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{acc.label}</p>
                                <p className={cn('text-xl font-bold mt-0.5 tabular-nums', acc.textColor)}>
                                    {acc.formatValue(balances[acc.key])}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{acc.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Ledger section */}
                <div className="rounded-xl border border-border overflow-hidden">

                    {/* Ledger header + filters */}
                    <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{account.icon}</span>
                            <div>
                                <h2 className="font-semibold text-sm">دفتر کل — {account.label}</h2>
                                <p className="text-xs text-muted-foreground">
                                    موجودی فعلی:{' '}
                                    <span className={cn('font-bold tabular-nums', account.textColor)}>
                                        {account.formatValue(balances[activeAccount])}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Date range filter */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-muted-foreground shrink-0">از</span>
                            <input
                                type="text"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="۱۴۰۳/۱۰/۰۱"
                                dir="ltr"
                                className="w-32 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-right focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <span className="text-xs text-muted-foreground shrink-0">تا</span>
                            <input
                                type="text"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="۱۴۰۳/۱۰/۳۰"
                                dir="ltr"
                                className="w-32 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-right focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {(dateFrom || dateTo) && (
                                <button
                                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    پاک
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                    <th className="px-5 py-3 text-start font-medium w-32">تاریخ</th>
                                    <th className="px-5 py-3 text-start font-medium">توضیح</th>
                                    <th className="px-5 py-3 text-end font-medium w-36">
                                        بدهکار {isTola ? '(تولا)' : activeAccount === 'afn' ? '(؋)' : '($)'}
                                    </th>
                                    <th className="px-5 py-3 text-end font-medium w-36">
                                        بستانکار {isTola ? '(تولا)' : activeAccount === 'afn' ? '(؋)' : '($)'}
                                    </th>
                                    <th className="px-5 py-3 text-end font-medium w-40">مانده</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-14 text-center text-muted-foreground text-sm">
                                            هیچ ردیفی یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map((row, idx) => {
                                        const isLast = idx === filteredRows.length - 1;
                                        return (
                                            <tr
                                                key={row.id}
                                                className={cn(
                                                    'transition-colors hover:bg-muted/20',
                                                    isLast && 'font-semibold bg-muted/10',
                                                )}
                                            >
                                                <td className="px-5 py-3 text-muted-foreground tabular-nums whitespace-nowrap">
                                                    {row.date}
                                                </td>
                                                <td className="px-5 py-3">{row.description}</td>
                                                <td className="px-5 py-3 text-end tabular-nums text-red-600 dark:text-red-400">
                                                    {formatCell(row.debit)}
                                                </td>
                                                <td className="px-5 py-3 text-end tabular-nums text-green-600 dark:text-green-400">
                                                    {formatCell(row.credit)}
                                                </td>
                                                <td className={cn('px-5 py-3 text-end tabular-nums font-medium', account.textColor)}>
                                                    {formatBalance(row.balance)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>

                            {/* Summary footer */}
                            {filteredRows.length > 0 && (
                                <tfoot>
                                    <tr className="border-t-2 border-border bg-muted/20 text-xs font-semibold">
                                        <td colSpan={2} className="px-5 py-3 text-muted-foreground">
                                            مجموع ({filteredRows.length} ردیف)
                                        </td>
                                        <td className="px-5 py-3 text-end tabular-nums text-red-600 dark:text-red-400">
                                            {formatCell(filteredRows.reduce((s, r) => s + r.debit, 0))}
                                        </td>
                                        <td className="px-5 py-3 text-end tabular-nums text-green-600 dark:text-green-400">
                                            {formatCell(filteredRows.reduce((s, r) => s + r.credit, 0))}
                                        </td>
                                        <td className={cn('px-5 py-3 text-end tabular-nums', account.textColor)}>
                                            {formatBalance(filteredRows[filteredRows.length - 1]?.balance ?? 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
