import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PartyOption, TransactionType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'تراکنش‌ها', href: '/transactions' },
    { title: 'تراکنش جدید', href: '/transactions/create' },
];

// ── Step 1 — transaction type ──────────────────────────────────────

type TypeCard = {
    type: TransactionType;
    emoji: string;
    label: string;
    desc: string;
    color: string;
    border: string;
};

const typeCards: TypeCard[] = [
    {
        type: 'buy',
        emoji: '📥',
        label: 'خرید طلا',
        desc: 'خرید طلا از مشتری یا سپلایر',
        color: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
    },
    {
        type: 'sell',
        emoji: '📤',
        label: 'فروش طلا',
        desc: 'فروش طلا به مشتری یا سپلایر',
        color: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
    },
    {
        type: 'trust_deposit',
        emoji: '🔒',
        label: 'امانت‌گذاری',
        desc: 'دریافت طلا به عنوان امانت',
        color: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
    },
    {
        type: 'transfer',
        emoji: '🔄',
        label: 'انتقال طلا',
        desc: 'انتقال طلا بین حساب‌ها',
        color: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800',
    },
];

// ── Ayar presets ────────────────────────────────────────────────────

const AYAR_PRESETS = [18, 21, 22, 23.77, 24];

// ── Form state ──────────────────────────────────────────────────────

type WeightUnit = 'tola' | 'gram';

type FormState = {
    type: TransactionType | null;
    // party
    party_type: 'customer' | 'supplier';
    party_id: string;
    // for transfer
    from_type: 'shop' | 'customer' | 'supplier';
    from_id: string;
    to_type: 'shop' | 'customer' | 'supplier';
    to_id: string;
    // gold details
    ayar: string;
    weight: string;
    weight_unit: WeightUnit;
    // pricing (buy/sell)
    rate_per_tola_usd: string;
    usd_to_afn_rate: string;
    payment_method: 'cash' | 'transfer';
    // trust
    notes: string;
    // transfer
    transport_fee: string;
};

const defaultForm: FormState = {
    type: null,
    party_type: 'customer',
    party_id: '',
    from_type: 'shop',
    from_id: '',
    to_type: 'customer',
    to_id: '',
    ayar: '24',
    weight: '',
    weight_unit: 'tola',
    rate_per_tola_usd: '190',
    usd_to_afn_rate: '70',
    payment_method: 'cash',
    notes: '',
    transport_fee: '',
};

// ── Calculations ────────────────────────────────────────────────────

function toTola(weight: number, unit: WeightUnit): number {
    return unit === 'gram' ? weight / 12.15 : weight;
}

function calc24Equiv(weightTola: number, ayar: number): number {
    return (weightTola * ayar) / 24;
}

function calcUsd(equiv24: number, ratePerTola: number): number {
    return equiv24 * ratePerTola;
}

function calcAfn(usd: number, rate: number): number {
    return usd * rate;
}

// ── Stepper component ───────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
    const steps = ['نوع تراکنش', 'جزئیات', 'تأیید'];
    return (
        <div className="flex items-center justify-center gap-0">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done = idx < step;
                const active = idx === step;
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-colors',
                                    done
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : active
                                          ? 'border-primary text-primary bg-primary/10'
                                          : 'border-muted-foreground/30 text-muted-foreground',
                                )}
                            >
                                {done ? <Check className="h-4 w-4" /> : idx}
                            </div>
                            <span
                                className={cn(
                                    'text-xs',
                                    active ? 'text-primary font-medium' : 'text-muted-foreground',
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    'mb-5 mx-2 h-0.5 w-16',
                                    done ? 'bg-primary' : 'bg-muted-foreground/20',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Field helpers ───────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-medium text-foreground mb-1.5">{children}</label>;
}

function InputField({
    value,
    onChange,
    placeholder,
    type = 'text',
    dir,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    dir?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            dir={dir}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
    );
}

function SelectField({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
            {children}
        </select>
    );
}

// ── Party select (customer or supplier) ────────────────────────────

function PartySelect({
    partyType,
    partyId,
    onTypeChange,
    onIdChange,
    customers,
    suppliers,
    label = 'طرف مقابل',
}: {
    partyType: 'customer' | 'supplier';
    partyId: string;
    onTypeChange: (v: 'customer' | 'supplier') => void;
    onIdChange: (v: string) => void;
    customers: PartyOption[];
    suppliers: PartyOption[];
    label?: string;
}) {
    const options = partyType === 'customer' ? customers : suppliers;
    return (
        <div className="space-y-2">
            <FieldLabel>{label}</FieldLabel>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => { onTypeChange('customer'); onIdChange(''); }}
                    className={cn(
                        'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                        partyType === 'customer'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input text-muted-foreground hover:bg-muted/50',
                    )}
                >
                    مشتری
                </button>
                <button
                    type="button"
                    onClick={() => { onTypeChange('supplier'); onIdChange(''); }}
                    className={cn(
                        'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                        partyType === 'supplier'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input text-muted-foreground hover:bg-muted/50',
                    )}
                >
                    سپلایر
                </button>
            </div>
            <SelectField value={partyId} onChange={onIdChange}>
                <option value="">-- انتخاب کنید --</option>
                {options.map((o) => (
                    <option key={o.id} value={String(o.id)}>{o.name}</option>
                ))}
            </SelectField>
        </div>
    );
}

// ── Weight input with unit toggle ───────────────────────────────────

function WeightInput({
    weight,
    unit,
    onWeightChange,
    onUnitChange,
}: {
    weight: string;
    unit: WeightUnit;
    onWeightChange: (v: string) => void;
    onUnitChange: (v: WeightUnit) => void;
}) {
    return (
        <div>
            <FieldLabel>وزن</FieldLabel>
            <div className="flex gap-2">
                <InputField
                    type="number"
                    value={weight}
                    onChange={onWeightChange}
                    placeholder="0.00"
                    dir="ltr"
                />
                <div className="flex rounded-lg border border-input overflow-hidden">
                    {(['tola', 'gram'] as WeightUnit[]).map((u) => (
                        <button
                            key={u}
                            type="button"
                            onClick={() => onUnitChange(u)}
                            className={cn(
                                'px-3 py-2 text-xs font-medium transition-colors',
                                unit === u
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:bg-muted/50',
                            )}
                        >
                            {u === 'tola' ? 'تولا' : 'گرام'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Ayar input with presets ─────────────────────────────────────────

function AyarInput({ ayar, onChange }: { ayar: string; onChange: (v: string) => void }) {
    return (
        <div>
            <FieldLabel>عیار طلا</FieldLabel>
            <div className="flex flex-wrap gap-1.5 mb-2">
                {AYAR_PRESETS.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(String(p))}
                        className={cn(
                            'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                            ayar === String(p)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-input text-muted-foreground hover:bg-muted/50',
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>
            <InputField type="number" value={ayar} onChange={onChange} placeholder="عیار (1-24)" dir="ltr" />
        </div>
    );
}

// ── Step 2 forms ────────────────────────────────────────────────────

function BuySellFields({
    form,
    setForm,
    customers,
    suppliers,
}: {
    form: FormState;
    setForm: (f: FormState) => void;
    customers: PartyOption[];
    suppliers: PartyOption[];
}) {
    const set = (key: keyof FormState) => (v: string) => setForm({ ...form, [key]: v });
    return (
        <div className="space-y-5">
            <PartySelect
                partyType={form.party_type}
                partyId={form.party_id}
                onTypeChange={(v) => setForm({ ...form, party_type: v, party_id: '' })}
                onIdChange={set('party_id')}
                customers={customers}
                suppliers={suppliers}
            />
            <AyarInput ayar={form.ayar} onChange={set('ayar')} />
            <WeightInput
                weight={form.weight}
                unit={form.weight_unit}
                onWeightChange={set('weight')}
                onUnitChange={(v) => setForm({ ...form, weight_unit: v })}
            />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <FieldLabel>نرخ تولا (USD)</FieldLabel>
                    <InputField type="number" value={form.rate_per_tola_usd} onChange={set('rate_per_tola_usd')} placeholder="190" dir="ltr" />
                </div>
                <div>
                    <FieldLabel>نرخ دالر به افغانی</FieldLabel>
                    <InputField type="number" value={form.usd_to_afn_rate} onChange={set('usd_to_afn_rate')} placeholder="70" dir="ltr" />
                </div>
            </div>
            <div>
                <FieldLabel>نوع پرداخت</FieldLabel>
                <div className="flex gap-2">
                    {(['cash', 'transfer'] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setForm({ ...form, payment_method: m })}
                            className={cn(
                                'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                                form.payment_method === m
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-input text-muted-foreground hover:bg-muted/50',
                            )}
                        >
                            {m === 'cash' ? 'نقد' : 'حواله حساب'}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <FieldLabel>یادداشت (اختیاری)</FieldLabel>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="یادداشت..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
            </div>
        </div>
    );
}

function TrustFields({
    form,
    setForm,
    customers,
}: {
    form: FormState;
    setForm: (f: FormState) => void;
    customers: PartyOption[];
}) {
    const set = (key: keyof FormState) => (v: string) => setForm({ ...form, [key]: v });
    return (
        <div className="space-y-5">
            <div>
                <FieldLabel>مشتری</FieldLabel>
                <SelectField value={form.party_id} onChange={set('party_id')}>
                    <option value="">-- انتخاب مشتری --</option>
                    {customers.map((c) => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                </SelectField>
            </div>
            <AyarInput ayar={form.ayar} onChange={set('ayar')} />
            <WeightInput
                weight={form.weight}
                unit={form.weight_unit}
                onWeightChange={set('weight')}
                onUnitChange={(v) => setForm({ ...form, weight_unit: v })}
            />
            <div>
                <FieldLabel>یادداشت</FieldLabel>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="یادداشت..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
            </div>
        </div>
    );
}

function TransferFields({
    form,
    setForm,
    customers,
    suppliers,
}: {
    form: FormState;
    setForm: (f: FormState) => void;
    customers: PartyOption[];
    suppliers: PartyOption[];
}) {
    const set = (key: keyof FormState) => (v: string) => setForm({ ...form, [key]: v });
    const partyTypes = [
        { value: 'shop', label: 'فروشگاه' },
        { value: 'customer', label: 'مشتری' },
        { value: 'supplier', label: 'سپلایر' },
    ] as const;

    function PartySection({
        label,
        typeKey,
        idKey,
    }: {
        label: string;
        typeKey: 'from_type' | 'to_type';
        idKey: 'from_id' | 'to_id';
    }) {
        const selectedType = form[typeKey];
        const options =
            selectedType === 'customer' ? customers : selectedType === 'supplier' ? suppliers : [];
        return (
            <div className="space-y-2">
                <FieldLabel>{label}</FieldLabel>
                <div className="flex gap-1.5">
                    {partyTypes.map((pt) => (
                        <button
                            key={pt.value}
                            type="button"
                            onClick={() => setForm({ ...form, [typeKey]: pt.value, [idKey]: '' })}
                            className={cn(
                                'flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors',
                                form[typeKey] === pt.value
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-input text-muted-foreground hover:bg-muted/50',
                            )}
                        >
                            {pt.label}
                        </button>
                    ))}
                </div>
                {selectedType !== 'shop' && (
                    <SelectField value={form[idKey]} onChange={(v) => setForm({ ...form, [idKey]: v })}>
                        <option value="">-- انتخاب کنید --</option>
                        {options.map((o) => (
                            <option key={o.id} value={String(o.id)}>{o.name}</option>
                        ))}
                    </SelectField>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PartySection label="از" typeKey="from_type" idKey="from_id" />
            <PartySection label="به" typeKey="to_type" idKey="to_id" />
            <AyarInput ayar={form.ayar} onChange={set('ayar')} />
            <WeightInput
                weight={form.weight}
                unit={form.weight_unit}
                onWeightChange={set('weight')}
                onUnitChange={(v) => setForm({ ...form, weight_unit: v })}
            />
            <div>
                <FieldLabel>هزینه ترانسپورت (افغانی)</FieldLabel>
                <InputField type="number" value={form.transport_fee} onChange={set('transport_fee')} placeholder="0" dir="ltr" />
            </div>
            <div>
                <FieldLabel>یادداشت (اختیاری)</FieldLabel>
                <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="یادداشت..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
            </div>
        </div>
    );
}

// ── Step 3 — summary ────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

const typeLabels: Record<TransactionType, string> = {
    buy: 'خرید طلا',
    sell: 'فروش طلا',
    trust_deposit: 'امانت‌گذاری',
    trust_withdraw: 'برداشت امانت',
    transfer: 'انتقال طلا',
};

function ConfirmStep({
    form,
    customers,
    suppliers,
}: {
    form: FormState;
    customers: PartyOption[];
    suppliers: PartyOption[];
}) {
    const type = form.type!;
    const weightNum = parseFloat(form.weight) || 0;
    const ayarNum = parseFloat(form.ayar) || 0;
    const weightTola = toTola(weightNum, form.weight_unit);
    const equiv24 = calc24Equiv(weightTola, ayarNum);
    const rateUsd = parseFloat(form.rate_per_tola_usd) || 0;
    const rateAfn = parseFloat(form.usd_to_afn_rate) || 0;
    const usd = calcUsd(equiv24, rateUsd);
    const afn = calcAfn(usd, rateAfn);
    const showPricing = type === 'buy' || type === 'sell';

    const getPartyName = (type: 'customer' | 'supplier', id: string) => {
        const list = type === 'customer' ? customers : suppliers;
        return list.find((x) => String(x.id) === id)?.name ?? '—';
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border p-4">
                <SummaryRow label="نوع تراکنش" value={typeLabels[type]} />
                {(type === 'buy' || type === 'sell' || type === 'trust_deposit') && (
                    <SummaryRow
                        label="طرف مقابل"
                        value={form.party_id ? getPartyName(form.party_type, form.party_id) : '—'}
                    />
                )}
                {type === 'transfer' && (
                    <>
                        <SummaryRow
                            label="از"
                            value={
                                form.from_type === 'shop'
                                    ? 'فروشگاه'
                                    : getPartyName(form.from_type as 'customer' | 'supplier', form.from_id)
                            }
                        />
                        <SummaryRow
                            label="به"
                            value={
                                form.to_type === 'shop'
                                    ? 'فروشگاه'
                                    : getPartyName(form.to_type as 'customer' | 'supplier', form.to_id)
                            }
                        />
                    </>
                )}
                <SummaryRow
                    label="وزن"
                    value={`${form.weight} ${form.weight_unit === 'tola' ? 'تولا' : 'گرام'}`}
                />
                <SummaryRow label="عیار" value={`${form.ayar} عیار`} />
                {showPricing && (
                    <>
                        <SummaryRow label="نوع پرداخت" value={form.payment_method === 'cash' ? 'نقد' : 'حواله حساب'} />
                        <SummaryRow label="نرخ تولا" value={`$${form.rate_per_tola_usd}`} />
                        <SummaryRow label="نرخ دالر به افغانی" value={`${form.usd_to_afn_rate} ؋`} />
                    </>
                )}
                {form.notes && <SummaryRow label="یادداشت" value={form.notes} />}
            </div>

            {showPricing && weightNum > 0 && ayarNum > 0 && rateUsd > 0 && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                    <p className="text-xs font-semibold text-primary mb-3">محاسبه خودکار</p>
                    <SummaryRow
                        label="معادل ۲۴ عیار"
                        value={`${equiv24.toFixed(3)} تولا`}
                    />
                    <SummaryRow
                        label="قیمت دالر"
                        value={<span className="text-green-700 dark:text-green-400">${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>}
                    />
                    <SummaryRow
                        label="قیمت افغانی"
                        value={<span className="text-blue-700 dark:text-blue-400">{afn.toLocaleString(undefined, { maximumFractionDigits: 0 })} ؋</span>}
                    />
                </div>
            )}
        </div>
    );
}

// ── Main page ───────────────────────────────────────────────────────

type Props = {
    customers: PartyOption[];
    suppliers: PartyOption[];
};

export default function TransactionsCreate({ customers, suppliers }: Props) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormState>(defaultForm);

    function handleTypeSelect(type: TransactionType) {
        setForm({ ...defaultForm, type });
        setStep(2);
    }

    function handleSubmit() {
        // Mock submit — just redirect
        router.visit('/transactions');
    }

    const canProceedStep2 = (() => {
        if (!form.type || !form.weight || parseFloat(form.weight) <= 0) return false;
        if (form.type === 'buy' || form.type === 'sell') return !!form.party_id;
        if (form.type === 'trust_deposit') return !!form.party_id;
        if (form.type === 'transfer') {
            if (form.from_type !== 'shop' && !form.from_id) return false;
            if (form.to_type !== 'shop' && !form.to_id) return false;
        }
        return true;
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تراکنش جدید" />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/transactions"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">تراکنش جدید</h1>
                        <p className="text-sm text-muted-foreground">ثبت تراکنش طلا</p>
                    </div>
                </div>

                {/* Stepper */}
                <Stepper step={step} />

                {/* Step 1 — pick type */}
                {step === 1 && (
                    <div>
                        <p className="text-sm text-muted-foreground mb-4 text-center">نوع تراکنش را انتخاب کنید</p>
                        <div className="grid grid-cols-2 gap-3">
                            {typeCards.map((card) => (
                                <button
                                    key={card.type}
                                    onClick={() => handleTypeSelect(card.type)}
                                    className={cn(
                                        'rounded-xl border-2 p-5 text-start transition-all hover:shadow-md hover:-translate-y-0.5',
                                        card.color,
                                        card.border,
                                    )}
                                >
                                    <div className="text-3xl mb-2">{card.emoji}</div>
                                    <div className="font-semibold text-sm">{card.label}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{card.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2 — details */}
                {step === 2 && form.type && (
                    <div className="rounded-xl border border-border p-5">
                        <h2 className="font-semibold mb-5 flex items-center gap-2">
                            <span className="text-xl">
                                {typeCards.find((c) => c.type === form.type)?.emoji}
                            </span>
                            {typeLabels[form.type]}
                        </h2>

                        {(form.type === 'buy' || form.type === 'sell') && (
                            <BuySellFields form={form} setForm={setForm} customers={customers} suppliers={suppliers} />
                        )}
                        {form.type === 'trust_deposit' && (
                            <TrustFields form={form} setForm={setForm} customers={customers} />
                        )}
                        {form.type === 'transfer' && (
                            <TransferFields form={form} setForm={setForm} customers={customers} suppliers={suppliers} />
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                            >
                                <ArrowRight className="h-4 w-4" />
                                قبلی
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                disabled={!canProceedStep2}
                                className={cn(
                                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                    canProceedStep2
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed',
                                )}
                            >
                                بعدی
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 — confirm */}
                {step === 3 && form.type && (
                    <div>
                        <div className="rounded-xl border border-border p-5">
                            <h2 className="font-semibold mb-5">تأیید تراکنش</h2>
                            <ConfirmStep form={form} customers={customers} suppliers={suppliers} />
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                            >
                                <ArrowRight className="h-4 w-4" />
                                ویرایش
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Check className="h-4 w-4" />
                                ثبت تراکنش
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
