import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, FullTransaction, TransactionType } from '@/types';

const typeConfig: Record<TransactionType, { label: string; emoji: string; classes: string }> = {
    buy: { label: 'خرید طلا', emoji: '📥', classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    sell: { label: 'فروش طلا', emoji: '📤', classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    trust_deposit: { label: 'امانت‌گذاری', emoji: '🔒', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    trust_withdraw: { label: 'برداشت امانت', emoji: '🔓', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    transfer: { label: 'انتقال طلا', emoji: '🔄', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
};

const statusConfig: Record<string, { label: string; classes: string }> = {
    completed: { label: 'تکمیل شده', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    pending: { label: 'در انتظار', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    cancelled: { label: 'لغو شده', classes: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-end">{children}</span>
        </div>
    );
}

type Props = { transaction: FullTransaction };

export default function TransactionsShow({ transaction: tx }: Props) {
    const cfg = typeConfig[tx.type];
    const statusCfg = statusConfig[tx.status] ?? statusConfig.pending;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'داشبورد', href: '/dashboard' },
        { title: 'تراکنش‌ها', href: '/transactions' },
        { title: `تراکنش #${tx.id}`, href: `/transactions/${tx.id}` },
    ];

    const showPricing = tx.type === 'buy' || tx.type === 'sell';

    // Calculate 24-ayar equivalent
    const equiv24 = tx.ayar < 24 ? ((tx.weight_tola * tx.ayar) / 24).toFixed(3) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تراکنش #${tx.id}`} />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/transactions"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">تراکنش #{tx.id}</h1>
                            <p className="text-sm text-muted-foreground">{tx.created_at}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled
                        title="چاپ (به زودی)"
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                    >
                        <Printer className="h-4 w-4" />
                        چاپ
                    </button>
                </div>

                {/* Type + status strip */}
                <div className="flex items-center gap-3">
                    <span className={cn('inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold', cfg.classes)}>
                        <span>{cfg.emoji}</span>
                        {cfg.label}
                    </span>
                    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', statusCfg.classes)}>
                        {statusCfg.label}
                    </span>
                </div>

                {/* Main details card */}
                <div className="rounded-xl border border-border p-5 space-y-0">
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">جزئیات</h2>

                    <DetailRow label="از">
                        <PartyLink party={tx.from_party} />
                    </DetailRow>
                    <DetailRow label="به">
                        <PartyLink party={tx.to_party} />
                    </DetailRow>
                    <DetailRow label="وزن">
                        <span className="tabular-nums">{tx.weight_tola} تولا</span>
                    </DetailRow>
                    <DetailRow label="عیار">
                        <span className="tabular-nums">{tx.ayar} عیار</span>
                    </DetailRow>
                    {equiv24 && (
                        <DetailRow label="معادل ۲۴ عیار">
                            <span className="tabular-nums text-amber-600 dark:text-amber-400">{equiv24} تولا</span>
                        </DetailRow>
                    )}
                </div>

                {/* Pricing card (buy/sell only) */}
                {showPricing && (
                    <div className="rounded-xl border border-border p-5 space-y-0">
                        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">مالی</h2>

                        {tx.rate_per_tola_usd && (
                            <DetailRow label="نرخ تولا">
                                <span className="tabular-nums">${tx.rate_per_tola_usd}</span>
                            </DetailRow>
                        )}
                        {tx.usd_to_afn_rate && (
                            <DetailRow label="نرخ دالر به افغانی">
                                <span className="tabular-nums">{tx.usd_to_afn_rate} ؋</span>
                            </DetailRow>
                        )}
                        {tx.amount_usd != null && (
                            <DetailRow label="مبلغ دالر">
                                <span className="tabular-nums text-green-700 dark:text-green-400 font-semibold">
                                    ${tx.amount_usd.toLocaleString()}
                                </span>
                            </DetailRow>
                        )}
                        {tx.amount_afn != null && (
                            <DetailRow label="مبلغ افغانی">
                                <span className="tabular-nums text-blue-700 dark:text-blue-400 font-semibold">
                                    {tx.amount_afn.toLocaleString()} ؋
                                </span>
                            </DetailRow>
                        )}
                        {tx.payment_method && (
                            <DetailRow label="نوع پرداخت">
                                {tx.payment_method === 'cash' ? 'نقد' : 'حواله حساب'}
                            </DetailRow>
                        )}
                    </div>
                )}

                {/* Notes */}
                {tx.notes && (
                    <div className="rounded-xl border border-border p-5">
                        <h2 className="text-sm font-semibold text-muted-foreground mb-2">یادداشت</h2>
                        <p className="text-sm">{tx.notes}</p>
                    </div>
                )}

                {/* Back button */}
                <div className="pt-2">
                    <Link
                        href="/transactions"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowRight className="h-4 w-4" />
                        بازگشت به لیست تراکنش‌ها
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

function PartyLink({ party }: { party: FullTransaction['from_party'] }) {
    if (party.type === 'shop') {
        return <span className="text-muted-foreground italic">فروشگاه</span>;
    }
    const href = party.type === 'customer' ? `/customers/${party.id}` : `/suppliers/${party.id}`;
    return (
        <Link href={href} className="text-primary hover:underline">
            {party.name}
        </Link>
    );
}
