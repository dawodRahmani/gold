import { Head } from '@inertiajs/react';
import { Calculator } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'ماشین حساب طلا', href: '/calculator' },
];

const AYAR_PRESETS = [18, 21, 22, 23.77, 24] as const;

type WeightUnit = 'gram' | 'tola';

function formatUSD(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAFN(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatWeight(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

interface CalcResult {
    equiv24Gram: number;
    equiv24Tola: number;
    priceUSD: number;
    priceAFN: number;
    priceEUR: number | null;
}

export default function CalculatorPage() {
    const [ayar, setAyar] = useState<string>('24');
    const [weight, setWeight] = useState<string>('');
    const [weightUnit, setWeightUnit] = useState<WeightUnit>('tola');
    const [tolaInGrams, setTolaInGrams] = useState<string>('11.664'); // grams per 1 tola
    const [rateTola, setRateTola] = useState<string>('');   // USD per tola (24-ayar)
    const [rateUsdAfn, setRateUsdAfn] = useState<string>(''); // AFN per 1 USD
    const [rateEurAfn, setRateEurAfn] = useState<string>(''); // AFN per 1 EUR (optional)

    const result = useMemo<CalcResult | null>(() => {
        const ayarNum = parseFloat(ayar);
        const weightNum = parseFloat(weight);
        const rateTolaNum = parseFloat(rateTola);
        const rateUsdAfnNum = parseFloat(rateUsdAfn);

        const tolaInGramsNum = parseFloat(tolaInGrams);
        if (!ayarNum || !weightNum || !rateTolaNum || !rateUsdAfnNum || !tolaInGramsNum) return null;
        if (ayarNum <= 0 || ayarNum > 24 || weightNum <= 0 || tolaInGramsNum <= 0) return null;

        const weightGrams = weightUnit === 'tola' ? weightNum * tolaInGramsNum : weightNum;
        const weightTola = weightUnit === 'gram' ? weightNum / tolaInGramsNum : weightNum;

        const equiv24Gram = weightGrams * (ayarNum / 24);
        const equiv24Tola = weightTola * (ayarNum / 24);

        const priceUSD = equiv24Tola * rateTolaNum;
        const priceAFN = priceUSD * rateUsdAfnNum;

        const rateEurAfnNum = parseFloat(rateEurAfn);
        const priceEUR = rateEurAfnNum > 0 ? priceAFN / rateEurAfnNum : null;

        return { equiv24Gram, equiv24Tola, priceUSD, priceAFN, priceEUR };
    }, [ayar, weight, weightUnit, tolaInGrams, rateTola, rateUsdAfn, rateEurAfn]);

    // Reference table rows: all presets for the current weight/rates
    const referenceRows = useMemo(() => {
        const weightNum = parseFloat(weight);
        const rateTolaNum = parseFloat(rateTola);
        const rateUsdAfnNum = parseFloat(rateUsdAfn);
        const tolaInGramsNum = parseFloat(tolaInGrams);
        if (!weightNum || !rateTolaNum || !rateUsdAfnNum || !tolaInGramsNum) return [];

        const weightTola = weightUnit === 'gram' ? weightNum / tolaInGramsNum : weightNum;

        return AYAR_PRESETS.map((a) => {
            const equiv24Tola = weightTola * (a / 24);
            const priceUSD = equiv24Tola * rateTolaNum;
            const priceAFN = priceUSD * rateUsdAfnNum;
            return { ayar: a, equiv24Tola, priceUSD, priceAFN };
        });
    }, [weight, weightUnit, tolaInGrams, rateTola, rateUsdAfn]);

    function handleReset() {
        setAyar('24');
        setWeight('');
        setWeightUnit('tola');
        setTolaInGrams('11.664');
        setRateTola('');
        setRateUsdAfn('');
        setRateEurAfn('');
    }

    const hasResult = result !== null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ماشین حساب طلا" />
            <div className="flex flex-col gap-6 p-6">

                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                        <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">ماشین حساب طلا</h1>
                        <p className="text-xs text-muted-foreground">محاسبه قیمت طلا بر اساس عیار، وزن و نرخ روز</p>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                    {/* ─── LEFT COLUMN — Inputs ─── */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            ورودی‌ها
                        </h2>

                        {/* Ayar */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">عیار طلا</label>
                            <div className="flex gap-2 flex-wrap">
                                {AYAR_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setAyar(String(preset))}
                                        className={cn(
                                            'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                                            ayar === String(preset)
                                                ? 'border-amber-500 bg-amber-500 text-white dark:bg-amber-600 dark:border-amber-600'
                                                : 'border-border bg-background text-foreground hover:border-amber-400 hover:text-amber-600',
                                        )}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                            <Input
                                type="number"
                                value={ayar}
                                onChange={(e) => setAyar(e.target.value)}
                                placeholder="عیار دلخواه (مثلاً ۲۱.۵)"
                                min={1}
                                max={24}
                                step={0.01}
                                dir="ltr"
                                className="text-right"
                            />
                        </div>

                        {/* Weight + unit toggle */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">وزن</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder={weightUnit === 'tola' ? 'تولا' : 'گرام'}
                                    min={0}
                                    step={0.001}
                                    dir="ltr"
                                    className="text-right flex-1"
                                />
                                <div className="flex rounded-lg border bg-muted/30 p-1 gap-1 shrink-0">
                                    {(['tola', 'gram'] as WeightUnit[]).map((unit) => (
                                        <button
                                            key={unit}
                                            onClick={() => setWeightUnit(unit)}
                                            className={cn(
                                                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                                                weightUnit === unit
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {unit === 'tola' ? 'تولا' : 'گرام'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground shrink-0">۱ تولا =</span>
                                <Input
                                    type="number"
                                    value={tolaInGrams}
                                    onChange={(e) => setTolaInGrams(e.target.value)}
                                    min={0.001}
                                    step={0.001}
                                    dir="ltr"
                                    className="h-7 w-28 text-right text-xs px-2"
                                />
                                <span className="text-xs text-muted-foreground shrink-0">گرام</span>
                            </div>
                        </div>

                        {/* Rate Tola (USD) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">
                                نرخ تولا (دالر)
                                <span className="mr-1 text-xs font-normal text-muted-foreground">— قیمت هر تولا ۲۴ عیار به دالر</span>
                            </label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                <Input
                                    type="number"
                                    value={rateTola}
                                    onChange={(e) => setRateTola(e.target.value)}
                                    placeholder="مثال: 3850"
                                    min={0}
                                    step={1}
                                    dir="ltr"
                                    className="pr-8 text-right"
                                />
                            </div>
                        </div>

                        {/* Rate USD → AFN */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">
                                نرخ دالر به افغانی
                                <span className="mr-1 text-xs font-normal text-muted-foreground">— ۱ دالر = چند افغانی</span>
                            </label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">؋</span>
                                <Input
                                    type="number"
                                    value={rateUsdAfn}
                                    onChange={(e) => setRateUsdAfn(e.target.value)}
                                    placeholder="مثال: 70"
                                    min={0}
                                    step={0.01}
                                    dir="ltr"
                                    className="pr-8 text-right"
                                />
                            </div>
                        </div>

                        {/* Rate EUR → AFN (optional) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">
                                نرخ یورو به افغانی
                                <span className="mr-1 text-xs font-normal text-muted-foreground">— اختیاری</span>
                            </label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                                <Input
                                    type="number"
                                    value={rateEurAfn}
                                    onChange={(e) => setRateEurAfn(e.target.value)}
                                    placeholder="مثال: 75"
                                    min={0}
                                    step={0.01}
                                    dir="ltr"
                                    className="pr-8 text-right"
                                />
                            </div>
                        </div>

                        {/* Reset */}
                        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                            پاک کردن
                        </Button>
                    </div>

                    {/* ─── RIGHT COLUMN — Results ─── */}
                    <div className="space-y-4">

                        {!hasResult ? (
                            <div className="rounded-xl border border-dashed border-border p-10 flex flex-col items-center justify-center text-center text-muted-foreground gap-3 h-full min-h-64">
                                <Calculator className="h-10 w-10 opacity-20" />
                                <p className="text-sm">عیار، وزن و نرخ تولا را وارد کنید</p>
                                <p className="text-xs">نتیجه به طور خودکار محاسبه می‌شود</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    نتیجه محاسبه
                                </h2>

                                {/* معادل ۲۴ عیار */}
                                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4">
                                    <p className="text-xs text-muted-foreground mb-1">معادل ۲۴ عیار</p>
                                    <p className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
                                        {formatWeight(result!.equiv24Gram)}
                                        <span className="text-base font-medium mr-1">گرام</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5 tabular-nums">
                                        {formatWeight(result!.equiv24Tola)} تولا
                                    </p>
                                </div>

                                {/* قیمت دالر */}
                                <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-4">
                                    <p className="text-xs text-muted-foreground mb-1">قیمت به دالر</p>
                                    <p className="text-2xl font-bold tabular-nums text-green-700 dark:text-green-400">
                                        ${formatUSD(result!.priceUSD)}
                                    </p>
                                </div>

                                {/* قیمت افغانی */}
                                <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
                                    <p className="text-xs text-muted-foreground mb-1">قیمت به افغانی</p>
                                    <p className="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                                        {formatAFN(result!.priceAFN)}
                                        <span className="text-base font-medium mr-1">؋</span>
                                    </p>
                                </div>

                                {/* قیمت یورو */}
                                {result!.priceEUR !== null && (
                                    <div className="rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30 p-4">
                                        <p className="text-xs text-muted-foreground mb-1">قیمت به یورو</p>
                                        <p className="text-2xl font-bold tabular-nums text-purple-700 dark:text-purple-400">
                                            €{formatUSD(result!.priceEUR)}
                                        </p>
                                    </div>
                                )}

                                {/* Input summary */}
                                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-sm">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">پارامترهای محاسبه</p>
                                    {[
                                        { label: 'عیار', value: `${ayar}` },
                                        { label: 'وزن', value: `${weight} ${weightUnit === 'tola' ? 'تولا' : 'گرام'}` },
                                        { label: 'نرخ تولا', value: `$${rateTola}` },
                                        { label: 'نرخ دالر', value: `${rateUsdAfn} ؋` },
                                        ...(rateEurAfn ? [{ label: 'نرخ یورو', value: `${rateEurAfn} ؋` }] : []),
                                    ].map((row) => (
                                        <div key={row.label} className="flex justify-between">
                                            <span className="text-muted-foreground">{row.label}</span>
                                            <span className="font-medium tabular-nums" dir="ltr">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ─── Reference Conversion Table ─── */}
                {referenceRows.length > 0 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border bg-muted/20">
                            <h2 className="text-sm font-semibold">جدول مقایسه عیارها</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                برای وزن {weight} {weightUnit === 'tola' ? 'تولا' : 'گرام'} — نرخ تولا ${rateTola}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                        <th className="px-5 py-3 text-start font-medium">عیار</th>
                                        <th className="px-5 py-3 text-start font-medium">وزن اصلی (تولا)</th>
                                        <th className="px-5 py-3 text-start font-medium">معادل ۲۴ عیار (تولا)</th>
                                        <th className="px-5 py-3 text-start font-medium">قیمت دالر</th>
                                        <th className="px-5 py-3 text-start font-medium">قیمت افغانی</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {referenceRows.map((row) => {
                                        const weightTola = weightUnit === 'gram'
                                            ? parseFloat(weight) / (parseFloat(tolaInGrams) || 11.664)
                                            : parseFloat(weight);
                                        const isActive = String(row.ayar) === ayar;
                                        return (
                                            <tr
                                                key={row.ayar}
                                                className={cn(
                                                    'transition-colors',
                                                    isActive
                                                        ? 'bg-amber-50 dark:bg-amber-950/20'
                                                        : 'hover:bg-muted/20',
                                                )}
                                            >
                                                <td className="px-5 py-3">
                                                    <span className={cn(
                                                        'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold',
                                                        isActive
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-muted text-muted-foreground',
                                                    )}>
                                                        {row.ayar}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 tabular-nums">{formatWeight(weightTola)}</td>
                                                <td className="px-5 py-3 tabular-nums font-medium text-amber-700 dark:text-amber-400">
                                                    {formatWeight(row.equiv24Tola)}
                                                </td>
                                                <td className="px-5 py-3 tabular-nums font-medium text-green-700 dark:text-green-400">
                                                    ${formatUSD(row.priceUSD)}
                                                </td>
                                                <td className="px-5 py-3 tabular-nums text-blue-700 dark:text-blue-400">
                                                    {formatAFN(row.priceAFN)} ؋
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
