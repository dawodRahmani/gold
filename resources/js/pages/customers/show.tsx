import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MapPin, MessageCircle, Pencil, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Customer, CustomerType, Transaction } from '@/types';

type Tab = 'transactions' | 'trust' | 'info';

const tabs: { value: Tab; label: string }[] = [
    { value: 'transactions', label: 'تراکنش‌ها' },
    { value: 'trust', label: 'امانت' },
    { value: 'info', label: 'معلومات' },
];

function TypeBadge({ type }: { type: CustomerType }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                type === 'permanent'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
            )}
        >
            {type === 'permanent' && <ShieldCheck className="size-3" />}
            {type === 'permanent' ? 'دایمی' : 'موقتی'}
        </span>
    );
}

function TransactionTypeBadge({ type }: { type: Transaction['type'] }) {
    const styles: Record<Transaction['type'], string> = {
        buy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        sell: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        trust_deposit: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        trust_withdraw: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        transfer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    };
    return (
        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', styles[type])}>
            {type === 'buy' && '📥'}
            {type === 'sell' && '📤'}
            {type === 'trust_deposit' && '🔒'}
            {type === 'trust_withdraw' && '🔓'}
            {type === 'transfer' && '🔄'}
            {' '}
            {type === 'buy' ? 'خرید' : type === 'sell' ? 'فروش' : type === 'trust_deposit' ? 'امانت' : type === 'trust_withdraw' ? 'برداشت امانت' : 'انتقال'}
        </span>
    );
}

function BalanceCard({
    label,
    value,
    unit,
    color,
}: {
    label: string;
    value: number;
    unit: string;
    color: string;
}) {
    return (
        <div className={cn('rounded-xl border p-4 text-center space-y-1', color)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn('text-xl font-bold tabular-nums', value === 0 && 'text-muted-foreground')}>
                {value === 0 ? '—' : value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{unit}</p>
        </div>
    );
}

type Props = {
    customer: Customer;
    transactions: Transaction[];
};

export default function CustomersShow({ customer, transactions }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('transactions');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'داشبورد', href: '/dashboard' },
        { title: 'مشتریان', href: '/customers' },
        { title: customer.name, href: `/customers/${customer.id}` },
    ];

    const trustTransactions = transactions.filter(
        (t) => t.type === 'trust_deposit' || t.type === 'trust_withdraw',
    );

    const trustBalance = trustTransactions.reduce((sum, t) => {
        return t.type === 'trust_deposit'
            ? sum + t.weight_tola
            : sum - t.weight_tola;
    }, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={customer.name} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Card */}
                <div className="rounded-xl border border-border p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl font-bold">{customer.name}</h1>
                                    <TypeBadge type={customer.type} />
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1" dir="ltr">
                                        <Phone className="size-3.5" />
                                        {customer.phone}
                                    </span>
                                    {customer.city && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-3.5" />
                                            {customer.city}
                                        </span>
                                    )}
                                    {customer.whatsapp && (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <MessageCircle className="size-3.5" />
                                            واتساپ
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    عضویت از: {customer.created_at}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 self-start">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/customers">
                                    <ArrowRight className="size-4 me-1" />
                                    بازگشت
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={`/customers/${customer.id}/edit`}>
                                    <Pencil className="size-4 me-1" />
                                    ویرایش
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Balance Strip */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <BalanceCard
                        label="موجودی پاسا"
                        value={customer.pasa_balance}
                        unit="تولا (۲۴ عیار)"
                        color="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                    />
                    <BalanceCard
                        label="موجودی طلا"
                        value={customer.gold_balance}
                        unit="تولا"
                        color="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
                    />
                    <BalanceCard
                        label="موجودی دالر"
                        value={customer.usd_balance}
                        unit="USD $"
                        color="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                    />
                    <BalanceCard
                        label="موجودی افغانی"
                        value={customer.afn_balance}
                        unit="افغانی ؋"
                        color="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                    />
                </div>

                {/* Tabs */}
                <div className="rounded-xl border border-border overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-border bg-muted/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                                    activeTab === tab.value
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {tab.label}
                                {tab.value === 'trust' && trustBalance > 0 && (
                                    <span className="me-2 ms-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                        {trustBalance} تولا
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab: Transactions */}
                    {activeTab === 'transactions' && (
                        <div>
                            {transactions.length === 0 ? (
                                <div className="py-16 text-center text-sm text-muted-foreground">
                                    هیچ تراکنشی ثبت نشده است
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                                <th className="px-4 py-3 text-start font-medium">نوع</th>
                                                <th className="px-4 py-3 text-start font-medium">مقدار (تولا)</th>
                                                <th className="px-4 py-3 text-start font-medium">عیار</th>
                                                <th className="px-4 py-3 text-start font-medium">مبلغ دالر</th>
                                                <th className="px-4 py-3 text-start font-medium">مبلغ افغانی</th>
                                                <th className="px-4 py-3 text-start font-medium">تاریخ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {transactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <TransactionTypeBadge type={tx.type} />
                                                    </td>
                                                    <td className="px-4 py-3 font-medium tabular-nums">
                                                        {tx.weight_tola}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                        {tx.ayar} عیار
                                                    </td>
                                                    <td className="px-4 py-3 text-green-700 dark:text-green-400 tabular-nums">
                                                        {tx.amount_usd
                                                            ? `$${tx.amount_usd.toLocaleString()}`
                                                            : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-blue-700 dark:text-blue-400 tabular-nums">
                                                        {tx.amount_afn
                                                            ? `${tx.amount_afn.toLocaleString()} ؋`
                                                            : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                        {tx.created_at}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Trust (Amanat) */}
                    {activeTab === 'trust' && (
                        <div className="p-5">
                            {trustBalance > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 p-4 flex items-center gap-4">
                                        <div className="text-3xl">🔒</div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">موجودی امانتی</p>
                                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                                                {trustBalance} تولا
                                            </p>
                                            <p className="text-xs text-muted-foreground">نزد فروشگاه</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto rounded-xl border">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                                    <th className="px-4 py-3 text-start font-medium">نوع</th>
                                                    <th className="px-4 py-3 text-start font-medium">مقدار</th>
                                                    <th className="px-4 py-3 text-start font-medium">عیار</th>
                                                    <th className="px-4 py-3 text-start font-medium">تاریخ</th>
                                                    <th className="px-4 py-3 text-start font-medium">یادداشت</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {trustTransactions.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-muted/20">
                                                        <td className="px-4 py-3">
                                                            <TransactionTypeBadge type={tx.type} />
                                                        </td>
                                                        <td className="px-4 py-3 font-medium tabular-nums">{tx.weight_tola} تولا</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{tx.ayar} عیار</td>
                                                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{tx.created_at}</td>
                                                        <td className="px-4 py-3 text-muted-foreground">{tx.notes || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-16 text-center text-sm text-muted-foreground">
                                    هیچ طلای امانتی ثبت نشده است
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Info */}
                    {activeTab === 'info' && (
                        <div className="p-5">
                            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                {[
                                    { label: 'نام و تخلص', value: customer.name },
                                    { label: 'شماره تلفن', value: customer.phone, ltr: true },
                                    { label: 'نوع مشتری', value: customer.type === 'permanent' ? 'دایمی' : 'موقتی' },
                                    { label: 'تاریخ عضویت', value: customer.created_at, ltr: false },
                                    ...(customer.type === 'permanent' ? [
                                        { label: 'شماره واتساپ', value: customer.whatsapp || '—', ltr: true },
                                        { label: 'شماره تذکره', value: customer.id_number || '—', ltr: true },
                                        { label: 'ولایت / شهر', value: customer.city || '—' },
                                        { label: 'آدرس', value: customer.address || '—' },
                                    ] : []),
                                    { label: 'یادداشت', value: customer.notes || '—' },
                                ].map((row) => (
                                    <div key={row.label} className="border-b border-border pb-3">
                                        <dt className="text-xs text-muted-foreground mb-0.5">{row.label}</dt>
                                        <dd
                                            className="font-medium text-sm"
                                            dir={row.ltr ? 'ltr' : undefined}
                                        >
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
