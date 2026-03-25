import { Head, Link } from '@inertiajs/react';
import { Building2, Phone, MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    name: string;
    phone: string;
    whatsapp: string;
    city: string;
    pasa_balance: number;
    usd_balance: number;
    afn_balance: number;
}

interface Transaction {
    id: number;
    date: string;
    type: string;
    amount_tola: number;
    usd: number;
    afn: number;
    status: string;
}

interface Props {
    supplier: Supplier;
    transactions: Transaction[];
}

type Tab = 'transactions' | 'info';

function formatNumber(n: number): string {
    return n.toLocaleString('en-US');
}

const TYPE_COLORS: Record<string, string> = {
    خرید: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    فروش: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
};

const STATUS_COLORS: Record<string, string> = {
    تکمیل: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    'در انتظار': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
};

export default function SupplierShow({ supplier, transactions }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('transactions');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'سپلایرها', href: '/suppliers' },
        { title: supplier.name, href: `/suppliers/${supplier.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={supplier.name} />
            <div className="flex flex-col gap-6 p-6">

                {/* Header Card */}
                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-700 text-xl font-bold dark:bg-amber-900/40 dark:text-amber-400 shrink-0">
                                {supplier.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{supplier.name}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5" />
                                        {supplier.phone}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {supplier.city}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                        <Building2 className="h-3 w-3" />
                                        سپلایر
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={`/suppliers/${supplier.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors shrink-0"
                        >
                            <Pencil className="h-3 w-3" />
                            ویرایش
                        </Link>
                    </div>
                </div>

                {/* Account Balances Strip */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                        <p className="text-xs text-muted-foreground mb-1">موجودی پاسا</p>
                        <p className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
                            {supplier.pasa_balance > 0 ? `${supplier.pasa_balance}` : '۰'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">تولا — ۲۴ عیار</p>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                        <p className="text-xs text-muted-foreground mb-1">موجودی دالر</p>
                        <p className="text-2xl font-bold tabular-nums text-green-700 dark:text-green-400">
                            ${formatNumber(supplier.usd_balance)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">دالر امریکایی</p>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                        <p className="text-xs text-muted-foreground mb-1">موجودی افغانی</p>
                        <p className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                            {formatNumber(supplier.afn_balance)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">افغانی</p>
                    </div>
                </div>

                {/* Tabs */}
                <div>
                    <div className="flex border-b border-border gap-1">
                        {([
                            { key: 'transactions', label: 'تراکنش‌ها' },
                            { key: 'info', label: 'معلومات' },
                        ] as { key: Tab; label: string }[]).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                    activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div className="mt-4 rounded-xl border border-border overflow-hidden">
                            <div className="grid grid-cols-6 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
                                <span>تاریخ</span>
                                <span>نوع</span>
                                <span>مقدار (تولا)</span>
                                <span>مبلغ (دالر)</span>
                                <span>مبلغ (افغانی)</span>
                                <span>وضعیت</span>
                            </div>
                            <div className="divide-y divide-border">
                                {transactions.length === 0 ? (
                                    <div className="px-5 py-14 text-center text-muted-foreground text-sm">
                                        هیچ تراکنشی ثبت نشده است
                                    </div>
                                ) : (
                                    transactions.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="grid grid-cols-6 items-center px-5 py-3.5 text-sm hover:bg-muted/20 transition-colors"
                                        >
                                            <span className="text-muted-foreground">{tx.date}</span>
                                            <span>
                                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[tx.type] ?? ''}`}>
                                                    {tx.type}
                                                </span>
                                            </span>
                                            <span className="tabular-nums font-medium">{tx.amount_tola}</span>
                                            <span className="tabular-nums text-green-600 dark:text-green-400">
                                                ${formatNumber(tx.usd)}
                                            </span>
                                            <span className="tabular-nums">
                                                {formatNumber(tx.afn)} ؋
                                            </span>
                                            <span>
                                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[tx.status] ?? ''}`}>
                                                    {tx.status}
                                                </span>
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
                            <div className="divide-y divide-border">
                                {[
                                    { label: 'نام', value: supplier.name },
                                    { label: 'شماره تلفن', value: supplier.phone },
                                    { label: 'شماره واتساپ', value: supplier.whatsapp || '—' },
                                    { label: 'شهر', value: supplier.city },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
                                        <span className="text-muted-foreground">{row.label}</span>
                                        <span className="font-medium">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
