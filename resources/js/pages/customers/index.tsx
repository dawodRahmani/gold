import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, Customer, CustomerType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'مشتریان', href: '/customers' },
];

type Tab = 'all' | CustomerType;

const tabs: { value: Tab; label: string; icon: typeof Users }[] = [
    { value: 'all', label: 'همه', icon: Users },
    { value: 'permanent', label: 'دایمی', icon: UserCheck },
    { value: 'ordinary', label: 'موقتی', icon: Users },
];

function TypeBadge({ type }: { type: CustomerType }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                type === 'permanent'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
            )}
        >
            {type === 'permanent' ? 'دایمی' : 'موقتی'}
        </span>
    );
}

function formatBalance(value: number, currency: string): string {
    if (value === 0) return '—';
    if (currency === 'usd') return `$${value.toLocaleString()}`;
    if (currency === 'afn') return `${value.toLocaleString()} ؋`;
    return `${value} تولا`;
}

function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users className="mb-4 size-12 opacity-30" />
            <p className="text-base font-medium">
                {filtered ? 'مشتری یافت نشد' : 'هنوز مشتری ثبت نشده است'}
            </p>
            {!filtered && (
                <p className="mt-1 text-sm">
                    برای شروع روی «مشتری جدید» کلیک کنید
                </p>
            )}
        </div>
    );
}

export default function CustomersIndex({ customers }: { customers: Customer[] }) {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('all');

    const filtered = customers
        .filter((c) => activeTab === 'all' || c.type === activeTab)
        .filter(
            (c) =>
                c.name.includes(search) ||
                c.phone.includes(search) ||
                (c.city ?? '').includes(search),
        );

    const counts = {
        all: customers.length,
        permanent: customers.filter((c) => c.type === 'permanent').length,
        ordinary: customers.filter((c) => c.type === 'ordinary').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مشتریان" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold">مشتریان</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {customers.length} مشتری ثبت شده
                        </p>
                    </div>
                    <Button asChild className="gap-2 self-start sm:self-auto">
                        <Link href="/customers/create">
                            <Plus className="size-4" />
                            مشتری جدید
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="جستجو بر اساس نام، تلفن یا شهر..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-9"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex rounded-lg border bg-muted/30 p-1 gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    activeTab === tab.value
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {tab.label}
                                <span
                                    className={cn(
                                        'rounded-full px-1.5 py-0.5 text-xs',
                                        activeTab === tab.value
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {counts[tab.value]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border overflow-hidden">
                    {filtered.length === 0 ? (
                        <EmptyState filtered={search !== '' || activeTab !== 'all'} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/20 text-xs text-muted-foreground">
                                        <th className="px-4 py-3 text-start font-medium">نام</th>
                                        <th className="px-4 py-3 text-start font-medium">شماره تلفن</th>
                                        <th className="px-4 py-3 text-start font-medium">نوع</th>
                                        <th className="px-4 py-3 text-start font-medium">شهر</th>
                                        <th className="px-4 py-3 text-start font-medium">موجودی پاسا</th>
                                        <th className="px-4 py-3 text-start font-medium">موجودی دالر</th>
                                        <th className="px-4 py-3 text-start font-medium">موجودی افغانی</th>
                                        <th className="px-4 py-3 text-start font-medium">تاریخ عضویت</th>
                                        <th className="px-4 py-3 text-center font-medium">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="group hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium">{customer.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 tabular-nums text-muted-foreground" dir="ltr">
                                                {customer.phone}
                                            </td>
                                            <td className="px-4 py-3">
                                                <TypeBadge type={customer.type} />
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {customer.city ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-amber-600 dark:text-amber-400 tabular-nums">
                                                {formatBalance(customer.pasa_balance, 'pasa')}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-green-700 dark:text-green-400 tabular-nums">
                                                {formatBalance(customer.usd_balance, 'usd')}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-blue-700 dark:text-blue-400 tabular-nums">
                                                {formatBalance(customer.afn_balance, 'afn')}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                {customer.created_at}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        title="مشاهده"
                                                    >
                                                        <Link href={`/customers/${customer.id}`}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                        title="ویرایش"
                                                    >
                                                        <Link href={`/customers/${customer.id}/edit`}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer count */}
                {filtered.length > 0 && (
                    <p className="text-xs text-muted-foreground text-end">
                        نمایش {filtered.length} از {customers.length} مشتری
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
