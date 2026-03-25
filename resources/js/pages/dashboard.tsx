import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: dashboard() },
];

const statCards = [
    {
        title: 'موجودی طلای پاسا',
        value: '۰ تولا',
        sub: '۲۴ عیار',
        icon: '⚜',
        color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
        title: 'موجودی دالر',
        value: '$۰',
        sub: 'دالر امریکایی',
        icon: '💵',
        color: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    {
        title: 'موجودی افغانی',
        value: '۰ ؋',
        sub: 'افغانی',
        icon: '💴',
        color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        title: 'معاملات امروز',
        value: '۰',
        sub: 'تراکنش',
        icon: '📋',
        color: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="داشبورد" />
            <div className="flex flex-col gap-6 p-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className={`rounded-xl border p-5 flex items-center gap-4 ${card.color}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${card.iconBg}`}>
                                {card.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">{card.title}</p>
                                <p className="text-2xl font-bold mt-0.5 tabular-nums">{card.value}</p>
                                <p className="text-xs text-muted-foreground">{card.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-sm font-semibold mb-3 text-muted-foreground">عملیات سریع</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { label: 'خرید طلا', icon: '📥', desc: 'ثبت خرید از مشتری' },
                            { label: 'فروش طلا', icon: '📤', desc: 'ثبت فروش به مشتری' },
                            { label: 'ثبت امانت', icon: '🔒', desc: 'طلای امانتی مشتری' },
                        ].map((action) => (
                            <button
                                key={action.label}
                                className="rounded-xl border border-dashed border-border p-6 text-center hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer group"
                            >
                                <div className="text-3xl mb-2">{action.icon}</div>
                                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{action.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                        <h2 className="font-semibold text-sm">آخرین تراکنش‌ها</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">امروز</span>
                    </div>
                    <div className="divide-y divide-border">
                        <div className="grid grid-cols-5 px-5 py-2.5 text-xs text-muted-foreground font-medium bg-muted/10">
                            <span>نوع</span>
                            <span>مشتری</span>
                            <span>مقدار (تولا)</span>
                            <span>مبلغ</span>
                            <span>تاریخ</span>
                        </div>
                        <div className="px-5 py-14 text-center text-muted-foreground text-sm">
                            هیچ تراکنشی ثبت نشده است
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
