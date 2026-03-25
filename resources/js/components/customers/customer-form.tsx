import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Customer, CustomerType } from '@/types';

type FormData = {
    name: string;
    phone: string;
    type: CustomerType;
    notes: string;
    whatsapp: string;
    address: string;
    city: string;
    id_number: string;
};

const AFGHAN_PROVINCES = [
    'کابل', 'هرات', 'مزار شریف', 'جلال‌آباد', 'قندهار', 'کندز',
    'بلخ', 'غزنی', 'تخار', 'بدخشان', 'بامیان', 'لوگر',
    'وردک', 'پکتیا', 'پکتیکا', 'زابل', 'ارزگان', 'هلمند',
    'نیمروز', 'فراه', 'بادغیس', 'غور', 'سمنگان', 'سرپل',
    'فاریاب', 'جوزجان', 'خوست', 'لغمان', 'نورستان', 'کنر',
    'پروان', 'کاپیسا', 'پنجشیر', 'ننگرهار',
];

type Props = {
    initialData?: Partial<Customer>;
    isEdit?: boolean;
};

export default function CustomerForm({ initialData, isEdit = false }: Props) {
    const [form, setForm] = useState<FormData>({
        name: initialData?.name ?? '',
        phone: initialData?.phone ?? '',
        type: initialData?.type ?? 'ordinary',
        notes: initialData?.notes ?? '',
        whatsapp: initialData?.whatsapp ?? '',
        address: initialData?.address ?? '',
        city: initialData?.city ?? '',
        id_number: initialData?.id_number ?? '',
    });

    const [showExtra, setShowExtra] = useState(
        form.type === 'permanent' || isEdit,
    );

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const setType = (type: CustomerType) => {
        setForm((prev) => ({ ...prev, type }));
        if (type === 'permanent') setShowExtra(true);
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!form.name.trim()) newErrors.name = 'نام الزامی است';
        if (!form.phone.trim()) newErrors.phone = 'شماره تلفن الزامی است';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEdit && initialData?.id) {
            router.put(`/customers/${initialData.id}`, form);
        } else {
            router.post('/customers', form);
        }
    };

    const isPermanent = form.type === 'permanent';

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 — Basic Info */}
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/20 px-5 py-3 border-b border-border">
                    <h2 className="font-semibold text-sm">معلومات اساسی</h2>
                </div>
                <div className="p-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">
                            نام و تخلص <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={set('name')}
                            placeholder="مثال: احمد شاه محمدزی"
                            className={cn(errors.name && 'border-destructive')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            شماره تلفن <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="phone"
                            value={form.phone}
                            onChange={set('phone')}
                            placeholder="0700-000-000"
                            dir="ltr"
                            className={cn('text-left', errors.phone && 'border-destructive')}
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label>نوع مشتری</Label>
                        <div className="flex rounded-lg border overflow-hidden">
                            {(['ordinary', 'permanent'] as CustomerType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        'flex-1 py-2 text-sm font-medium transition-colors',
                                        form.type === t
                                            ? t === 'permanent'
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-primary text-primary-foreground'
                                            : 'bg-background text-muted-foreground hover:bg-muted/50',
                                    )}
                                >
                                    {t === 'permanent' ? '⭐ دایمی' : 'موقتی'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notes">یادداشت</Label>
                        <textarea
                            id="notes"
                            value={form.notes}
                            onChange={set('notes')}
                            placeholder="یادداشت‌های اضافی (اختیاری)"
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2 — Full Profile (permanent) */}
            <div className="rounded-xl border border-border overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowExtra((v) => !v)}
                    className="w-full flex items-center justify-between bg-muted/20 px-5 py-3 border-b border-border hover:bg-muted/30 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-sm">معلومات تکمیلی</h2>
                        {isPermanent && (
                            <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 text-xs">
                                برای مشتری دایمی
                            </span>
                        )}
                    </div>
                    {showExtra ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                </button>

                {showExtra && (
                    <div className="p-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">شماره واتساپ</Label>
                            <Input
                                id="whatsapp"
                                value={form.whatsapp}
                                onChange={set('whatsapp')}
                                placeholder="93700000000"
                                dir="ltr"
                                className="text-left"
                            />
                            <p className="text-xs text-muted-foreground">
                                برای ارسال پیام‌های خودکار
                            </p>
                        </div>

                        {/* ID Number */}
                        <div className="space-y-2">
                            <Label htmlFor="id_number">شماره تذکره</Label>
                            <Input
                                id="id_number"
                                value={form.id_number}
                                onChange={set('id_number')}
                                placeholder="شماره تذکره ملی"
                                dir="ltr"
                                className="text-left"
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label htmlFor="city">ولایت / شهر</Label>
                            <select
                                id="city"
                                value={form.city}
                                onChange={set('city')}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">انتخاب ولایت...</option>
                                {AFGHAN_PROVINCES.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="address">آدرس</Label>
                            <Input
                                id="address"
                                value={form.address}
                                onChange={set('address')}
                                placeholder="آدرس کامل..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
                <Button type="button" variant="outline" asChild>
                    <Link href="/customers">
                        <ArrowRight className="size-4 me-1" />
                        انصراف
                    </Link>
                </Button>
                <Button type="submit" className="min-w-28">
                    {isEdit ? 'ذخیره تغییرات' : 'ثبت مشتری'}
                </Button>
            </div>
        </form>
    );
}
