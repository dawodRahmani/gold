import { Head } from '@inertiajs/react';
import { Settings, TrendingUp, MessageCircle, Users, Plus, CheckCircle, XCircle, Scale, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'تنظیمات', href: '/store-settings' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurrentRates {
    usd_to_afn: number;
    eur_to_afn: number;
    tola_usd: number;
}

interface RateHistoryRow {
    id: number;
    date: string;
    usd_to_afn: number;
    eur_to_afn: number;
    tola_usd: number;
    set_by: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'accountant' | 'viewer';
    active: boolean;
}

interface Units {
    tola_grams: number;
    ayar_presets: number[];
    default_city: string;
    default_weight_unit: 'tola' | 'gram';
    shop_name: string;
}

interface Props {
    currentRates: CurrentRates;
    rateHistory: RateHistoryRow[];
    users: User[];
    units: Units;
}

type Tab = 'rates' | 'units' | 'whatsapp' | 'users';

// ─── Sub-components ───────────────────────────────────────────────────────────

const ROLE_LABELS: Record<User['role'], string> = {
    admin: 'ادمین',
    accountant: 'حسابدار',
    viewer: 'بیننده',
};

const ROLE_STYLES: Record<User['role'], string> = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    accountant: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    viewer: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function RoleBadge({ role }: { role: User['role'] }) {
    return (
        <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', ROLE_STYLES[role])}>
            {ROLE_LABELS[role]}
        </span>
    );
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
    );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function RatesTab({ currentRates, rateHistory }: { currentRates: CurrentRates; rateHistory: RateHistoryRow[] }) {
    const [usdAfn, setUsdAfn]   = useState(String(currentRates.usd_to_afn));
    const [eurAfn, setEurAfn]   = useState(String(currentRates.eur_to_afn));
    const [tolaUsd, setTolaUsd] = useState(String(currentRates.tola_usd));
    const [saved, setSaved]     = useState(false);

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        // Mock save
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <div className="space-y-6">
            {/* Current rates form */}
            <div className="rounded-xl border border-border bg-card p-5">
                <SectionHeading
                    title="نرخ‌های فعلی"
                    description="این نرخ‌ها در تمام محاسبات سیستم استفاده می‌شوند"
                />
                <form onSubmit={handleSave} className="space-y-4 max-w-sm">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">نرخ دالر به افغانی</label>
                        <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">۱$ =</span>
                            <Input
                                type="number"
                                value={usdAfn}
                                onChange={(e) => setUsdAfn(e.target.value)}
                                step={0.01}
                                min={0}
                                dir="ltr"
                                className="pr-12 text-right"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">؋</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">نرخ یورو به افغانی</label>
                        <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€1 =</span>
                            <Input
                                type="number"
                                value={eurAfn}
                                onChange={(e) => setEurAfn(e.target.value)}
                                step={0.01}
                                min={0}
                                dir="ltr"
                                className="pr-12 text-right"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">؋</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">نرخ تولا (دالر)</label>
                        <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">۱ تولا =</span>
                            <Input
                                type="number"
                                value={tolaUsd}
                                onChange={(e) => setTolaUsd(e.target.value)}
                                step={1}
                                min={0}
                                dir="ltr"
                                className="pr-16 text-right"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <Button type="submit" size="sm">
                            ذخیره نرخ‌ها
                        </Button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                                ذخیره شد
                            </span>
                        )}
                    </div>
                </form>
            </div>

            {/* Rate history */}
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border bg-muted/20">
                    <h3 className="text-sm font-semibold">تاریخچه نرخ‌ها</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                <th className="px-5 py-3 text-start font-medium">تاریخ</th>
                                <th className="px-5 py-3 text-start font-medium">دالر / افغانی</th>
                                <th className="px-5 py-3 text-start font-medium">یورو / افغانی</th>
                                <th className="px-5 py-3 text-start font-medium">نرخ تولا ($)</th>
                                <th className="px-5 py-3 text-start font-medium">ثبت کننده</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {rateHistory.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    className={cn(
                                        'transition-colors hover:bg-muted/20',
                                        idx === 0 && 'bg-amber-50/50 dark:bg-amber-950/10',
                                    )}
                                >
                                    <td className="px-5 py-3 tabular-nums text-muted-foreground">
                                        {row.date}
                                        {idx === 0 && (
                                            <span className="mr-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                                فعلی
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 tabular-nums">{row.usd_to_afn} ؋</td>
                                    <td className="px-5 py-3 tabular-nums">{row.eur_to_afn} ؋</td>
                                    <td className="px-5 py-3 tabular-nums">${row.tola_usd.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{row.set_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const AFGHAN_PROVINCES = [
    'کابل','هرات','مزار شریف','قندهار','جلال‌آباد','ننگرهار','بلخ','بدخشان','تخار','کندوز',
    'باغلان','بامیان','غور','فراه','هلمند','پکتیا','لوگر','وردک','زابل','ارزگان',
    'نیمروز','هیرمند','بادغیس','بادغیس','سرپل','سمنگان','جوزجان','فاریاب',
    'غزنی','پکتیکا','خوست','کنر','لغمان','نورستان','پنجشیر','کاپیسا','پروان',
    'میدان وردک','دایکندی',
];

function UnitsTab({ units }: { units: Units }) {
    const [tolaGrams, setTolaGrams]         = useState(String(units.tola_grams));
    const [presets, setPresets]             = useState<number[]>(units.ayar_presets);
    const [newPreset, setNewPreset]         = useState('');
    const [defaultCity, setDefaultCity]     = useState(units.default_city);
    const [weightUnit, setWeightUnit]       = useState<'tola' | 'gram'>(units.default_weight_unit);
    const [shopName, setShopName]           = useState(units.shop_name);
    const [saved, setSaved]                 = useState(false);

    function addPreset() {
        const v = parseFloat(newPreset);
        if (!isNaN(v) && v > 0 && v <= 24 && !presets.includes(v)) {
            setPresets((p) => [...p, v].sort((a, b) => a - b));
            setNewPreset('');
        }
    }

    function removePreset(val: number) {
        setPresets((p) => p.filter((x) => x !== val));
    }

    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">

            {/* Shop name */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <SectionHeading
                    title="نام فروشگاه"
                    description="نامی که در هدر سیستم نمایش داده می‌شود"
                />
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">نام فروشگاه</label>
                    <Input
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="سیستم مدیریت طلا فروشی"
                    />
                </div>
            </div>

            {/* Weight units */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <SectionHeading
                    title="واحد وزن"
                    description="تبدیل بین تولا و گرام در تمام محاسبات استفاده می‌شود"
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">یک تولا برابر چند گرام؟</label>
                    <div className="relative max-w-48">
                        <Input
                            type="number"
                            value={tolaGrams}
                            onChange={(e) => setTolaGrams(e.target.value)}
                            step={0.001}
                            min={1}
                            max={20}
                            dir="ltr"
                            className="text-right pe-12"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">گرام</span>
                    </div>
                    <p className="text-xs text-muted-foreground">استاندارد افغانستان: ۱۲.۱۵ گرام · هند: ۱۱.۶۶ · پاکستان: ۱۱.۳۴</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">واحد پیش‌فرض در فرم‌ها</label>
                    <div className="flex gap-2">
                        {(['tola', 'gram'] as const).map((u) => (
                            <button
                                key={u}
                                type="button"
                                onClick={() => setWeightUnit(u)}
                                className={cn(
                                    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                                    weightUnit === u
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:bg-muted/60',
                                )}
                            >
                                {u === 'tola' ? 'تولا' : 'گرام'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ayar presets */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <SectionHeading
                    title="عیارهای پیش‌فرض"
                    description="این عیارها به‌عنوان دکمه‌های سریع در فرم تراکنش و ماشین حساب نمایش داده می‌شوند"
                />

                {/* Current presets */}
                <div className="flex flex-wrap gap-2">
                    {presets.map((v) => (
                        <span
                            key={v}
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                        >
                            {v} عیار
                            <button
                                type="button"
                                onClick={() => removePreset(v)}
                                className="rounded-full p-0.5 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                                title="حذف"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    {presets.length === 0 && (
                        <p className="text-sm text-muted-foreground">هیچ عیاری تعریف نشده</p>
                    )}
                </div>

                {/* Add new preset */}
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={newPreset}
                        onChange={(e) => setNewPreset(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreset())}
                        placeholder="مثلاً 20"
                        min={1}
                        max={24}
                        step={0.01}
                        dir="ltr"
                        className="w-32 text-right"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addPreset}>
                        <Plus className="h-3.5 w-3.5 me-1" />
                        افزودن
                    </Button>
                    <p className="text-xs text-muted-foreground">بین ۱ تا ۲۴</p>
                </div>
            </div>

            {/* Default city */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <SectionHeading
                    title="پیش‌فرض‌های فرم"
                    description="این مقادیر در هنگام ثبت مشتری یا سپلایر جدید از پیش پر می‌شوند"
                />
                <div className="space-y-1.5 max-w-64">
                    <label className="text-sm font-medium">شهر / ولایت پیش‌فرض</label>
                    <select
                        value={defaultCity}
                        onChange={(e) => setDefaultCity(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {AFGHAN_PROVINCES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Save button */}
            <div className="flex items-center gap-3">
                <Button type="submit" size="sm">
                    ذخیره تنظیمات
                </Button>
                {saved && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        ذخیره شد
                    </span>
                )}
            </div>
        </form>
    );
}

function WhatsAppTab() {
    const [apiKey, setApiKey]       = useState('');
    const [testNumber, setTestNumber] = useState('');

    return (
        <div className="rounded-xl border border-border bg-card p-5 max-w-lg">
            <SectionHeading
                title="تنظیمات واتساپ"
                description="برای ارسال پیام خودکار به مشتریان از واتساپ API استفاده کنید"
            />
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">API Key</label>
                    <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="وارد کنید..."
                        dir="ltr"
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">کلید API از پنل واتساپ بیزنس</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">شماره آزمایشی</label>
                    <Input
                        type="text"
                        value={testNumber}
                        onChange={(e) => setTestNumber(e.target.value)}
                        placeholder="93700000000"
                        dir="ltr"
                        className="text-right"
                    />
                    <p className="text-xs text-muted-foreground">شماره‌ای که پیام آزمایشی به آن ارسال می‌شود</p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <Button size="sm" disabled>
                        ذخیره تنظیمات
                    </Button>
                    <Button size="sm" variant="outline" disabled>
                        <MessageCircle className="h-3.5 w-3.5 ml-1.5" />
                        ارسال پیام آزمایشی
                    </Button>
                </div>

                <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20 p-3 text-xs text-amber-700 dark:text-amber-400">
                    این بخش در نسخه آینده فعال می‌شود.
                </div>
            </div>
        </div>
    );
}

function UsersTab({ users }: { users: User[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{users.length} کاربر</p>
                <Button size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    کاربر جدید
                </Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/10 text-xs text-muted-foreground">
                                <th className="px-5 py-3 text-start font-medium">نام</th>
                                <th className="px-5 py-3 text-start font-medium">ایمیل</th>
                                <th className="px-5 py-3 text-start font-medium">نقش</th>
                                <th className="px-5 py-3 text-center font-medium">وضعیت</th>
                                <th className="px-5 py-3 text-center font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground" dir="ltr">
                                        {user.email}
                                    </td>
                                    <td className="px-5 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {user.active ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                فعال
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                <XCircle className="h-3.5 w-3.5" />
                                                غیرفعال
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                                            ویرایش
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: typeof Settings }[] = [
    { key: 'rates',     label: 'نرخ ارز',    icon: TrendingUp    },
    { key: 'units',     label: 'واحدها',     icon: Scale         },
    { key: 'whatsapp',  label: 'واتساپ',     icon: MessageCircle },
    { key: 'users',     label: 'کاربران',    icon: Users         },
];

export default function StoreSettingsPage({ currentRates, rateHistory, users, units }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('rates');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تنظیمات" />
            <div className="flex flex-col gap-6 p-6">

                {/* Page header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">تنظیمات</h1>
                        <p className="text-xs text-muted-foreground">نرخ ارز، واتساپ و مدیریت کاربران</p>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="flex border-b border-border gap-1">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                                    activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                <div>
                    {activeTab === 'rates'    && <RatesTab currentRates={currentRates} rateHistory={rateHistory} />}
                    {activeTab === 'units'    && <UnitsTab units={units} />}
                    {activeTab === 'whatsapp' && <WhatsAppTab />}
                    {activeTab === 'users'    && <UsersTab users={users} />}
                </div>

            </div>
        </AppLayout>
    );
}
