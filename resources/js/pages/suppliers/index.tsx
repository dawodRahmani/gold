import { Head, Link } from '@inertiajs/react';
import { Building2, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    name: string;
    phone: string;
    city: string;
    pasa_balance: number;
    usd_balance: number;
    afn_balance: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'سپلایرها', href: '/suppliers' },
];

function formatNumber(n: number): string {
    return n.toLocaleString('en-US');
}

export default function SuppliersIndex({ suppliers }: { suppliers: Supplier[] }) {
    const [search, setSearch] = useState('');

    const filtered = suppliers.filter(
        (s) =>
            s.name.includes(search) ||
            s.phone.includes(search) ||
            s.city.includes(search),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="سپلایرها" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                            <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">سپلایرها</h1>
                            <p className="text-xs text-muted-foreground">{suppliers.length} سپلایر</p>
                        </div>
                    </div>
                    <Link
                        href="/suppliers/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        سپلایر جدید
                    </Link>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، تلفن یا شهر..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2 pr-9 pl-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 bg-muted/30 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
                        <span>نام</span>
                        <span>شهر</span>
                        <span>موجودی پاسا</span>
                        <span>موجودی دالر</span>
                        <span>موجودی افغانی</span>
                        <span className="text-center">عملیات</span>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <div className="px-5 py-14 text-center text-muted-foreground text-sm">
                                هیچ سپلایری یافت نشد
                            </div>
                        ) : (
                            filtered.map((supplier) => (
                                <div
                                    key={supplier.id}
                                    className="grid grid-cols-6 items-center px-5 py-4 text-sm hover:bg-muted/20 transition-colors"
                                >
                                    {/* Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold dark:bg-amber-900/40 dark:text-amber-400 shrink-0">
                                            {supplier.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{supplier.name}</p>
                                            <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                                        </div>
                                    </div>

                                    {/* City */}
                                    <span className="text-muted-foreground">{supplier.city}</span>

                                    {/* Pasa */}
                                    <div>
                                        <span className="font-medium tabular-nums">
                                            {supplier.pasa_balance > 0
                                                ? `${supplier.pasa_balance} تولا`
                                                : '—'}
                                        </span>
                                        {supplier.pasa_balance > 0 && (
                                            <p className="text-xs text-muted-foreground">۲۴ عیار</p>
                                        )}
                                    </div>

                                    {/* USD */}
                                    <span className={`tabular-nums font-medium ${supplier.usd_balance > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                        {supplier.usd_balance > 0 ? `$${formatNumber(supplier.usd_balance)}` : '—'}
                                    </span>

                                    {/* AFN */}
                                    <span className={`tabular-nums font-medium ${supplier.afn_balance > 0 ? '' : 'text-muted-foreground'}`}>
                                        {supplier.afn_balance > 0 ? `${formatNumber(supplier.afn_balance)} ؋` : '—'}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={`/suppliers/${supplier.id}`}
                                            className="rounded-md px-3 py-1 text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                                        >
                                            پروفایل
                                        </Link>
                                        <Link
                                            href={`/suppliers/${supplier.id}/edit`}
                                            className="rounded-md px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                                        >
                                            ویرایش
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {filtered.length > 0 && (
                        <div className="px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
                            {filtered.length} سپلایر نمایش داده شد
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
