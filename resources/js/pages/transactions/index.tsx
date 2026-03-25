import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftRight, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FullTransaction, TransactionType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'تراکنش‌ها', href: '/transactions' },
];

type TypeFilter = TransactionType | 'all';

const typeFilters: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'همه' },
    { value: 'buy', label: 'خرید' },
    { value: 'sell', label: 'فروش' },
    { value: 'trust_deposit', label: 'امانت' },
    { value: 'trust_withdraw', label: 'برداشت امانت' },
    { value: 'transfer', label: 'انتقال' },
];

const typeConfig: Record<TransactionType, { label: string; classes: string }> = {
    buy: { label: 'خرید', classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    sell: { label: 'فروش', classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    trust_deposit: { label: 'امانت', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    trust_withdraw: { label: 'برداشت امانت', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    transfer: { label: 'انتقال', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
};

const statusConfig: Record<string, { label: string; classes: string }> = {
    completed: { label: 'تکمیل', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    pending: { label: 'در انتظار', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    cancelled: { label: 'لغو شده', classes: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

function TypeBadge({ type }: { type: TransactionType }) {
    const cfg = typeConfig[type];
    return (
        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.classes)}>
            {cfg.label}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? statusConfig.pending;
    return (
        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.classes)}>
            {cfg.label}
        </span>
    );
}

type Props = { transactions: FullTransaction[] };

export default function TransactionsIndex({ transactions }: Props) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

    const filtered = transactions.filter((tx) => {
        const matchType = typeFilter === 'all' || tx.type === typeFilter;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            tx.from_party.name.includes(search) ||
            tx.to_party.name.includes(search) ||
            tx.created_at.includes(search);
        return matchType && matchSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تراکنش‌ها" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ArrowLeftRight className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">تراکنش‌ها</h1>
                            <p className="text-xs text-muted-foreground">{transactions.length} تراکنش</p>
                        </div>
                    </div>
                    <Link
                        href="/transactions/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        تراکنش جدید
                    </Link>
                </div>

                {/* Filter bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="جستجو بر اساس نام..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background py-2 pr-9 pl-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {/* Type filter tabs */}
                    <div className="flex flex-wrap gap-1.5">
                        {typeFilters.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setTypeFilter(f.value)}
                                className={cn(
                                    'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                                    typeFilter === f.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                )}
                            >
                                {f.label}
                                {f.value !== 'all' && (
                                    <span className="me-1 ms-1">
                                        ({transactions.filter((tx) => tx.type === f.value).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                    <th className="px-4 py-3 text-start font-medium">تاریخ</th>
                                    <th className="px-4 py-3 text-start font-medium">نوع</th>
                                    <th className="px-4 py-3 text-start font-medium">از</th>
                                    <th className="px-4 py-3 text-start font-medium">به</th>
                                    <th className="px-4 py-3 text-start font-medium">مقدار (تولا)</th>
                                    <th className="px-4 py-3 text-start font-medium">عیار</th>
                                    <th className="px-4 py-3 text-start font-medium">مبلغ دالر</th>
                                    <th className="px-4 py-3 text-start font-medium">مبلغ افغانی</th>
                                    <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                                    <th className="px-4 py-3 text-center font-medium">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="py-16 text-center text-sm text-muted-foreground">
                                            هیچ تراکنشی یافت نشد
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground tabular-nums">{tx.created_at}</td>
                                            <td className="px-4 py-3">
                                                <TypeBadge type={tx.type} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <PartyCell party={tx.from_party} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <PartyCell party={tx.to_party} />
                                            </td>
                                            <td className="px-4 py-3 font-medium tabular-nums">{tx.weight_tola}</td>
                                            <td className="px-4 py-3 text-muted-foreground tabular-nums">{tx.ayar} عیار</td>
                                            <td className="px-4 py-3 text-green-700 dark:text-green-400 tabular-nums">
                                                {tx.amount_usd ? `$${tx.amount_usd.toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-blue-700 dark:text-blue-400 tabular-nums">
                                                {tx.amount_afn ? `${tx.amount_afn.toLocaleString()} ؋` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={tx.status} />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={`/transactions/${tx.id}`}
                                                    className="rounded-md px-3 py-1 text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                                                >
                                                    جزئیات
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length > 0 && (
                        <div className="border-t border-border bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
                            نمایش {filtered.length} از {transactions.length} تراکنش
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function PartyCell({ party }: { party: FullTransaction['from_party'] }) {
    const isShop = party.type === 'shop';
    return (
        <span className={cn('text-sm', isShop ? 'text-muted-foreground italic' : 'font-medium')}>
            {party.name}
        </span>
    );
}
