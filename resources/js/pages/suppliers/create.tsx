import { Head, useForm } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    name: string;
    phone: string;
    whatsapp: string;
    city: string;
}

interface Props {
    supplier: Supplier | null;
}

const CITIES = ['کابل', 'مزار شریف', 'هرات', 'قندهار', 'جلال‌آباد', 'کندز', 'بامیان', 'غزنی', 'پکتیا', 'ننگرهار'];

export default function SupplierCreate({ supplier }: Props) {
    const isEdit = supplier !== null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'سپلایرها', href: '/suppliers' },
        { title: isEdit ? 'ویرایش سپلایر' : 'سپلایر جدید', href: isEdit ? `/suppliers/${supplier!.id}/edit` : '/suppliers/create' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name ?? '',
        phone: supplier?.phone ?? '',
        whatsapp: supplier?.whatsapp ?? '',
        city: supplier?.city ?? 'کابل',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEdit) {
            put(`/suppliers/${supplier!.id}`);
        } else {
            post('/suppliers');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'ویرایش سپلایر' : 'سپلایر جدید'} />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                        <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">
                            {isEdit ? 'ویرایش سپلایر' : 'ثبت سپلایر جدید'}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {isEdit ? `ویرایش معلومات ${supplier!.name}` : 'معلومات سپلایر را وارد کنید'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5">

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium">
                            نام <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="نام کامل سپلایر"
                            required
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-sm font-medium">
                            شماره تلفن <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="مثال: 0700-000-000"
                            required
                            dir="ltr"
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                        <label htmlFor="whatsapp" className="text-sm font-medium">
                            شماره واتساپ
                        </label>
                        <input
                            id="whatsapp"
                            type="text"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            placeholder="مثال: 93700000000"
                            dir="ltr"
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
                        />
                        {errors.whatsapp && (
                            <p className="text-xs text-destructive">{errors.whatsapp}</p>
                        )}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                        <label htmlFor="city" className="text-sm font-medium">
                            شهر
                        </label>
                        <select
                            id="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {CITIES.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        {errors.city && (
                            <p className="text-xs text-destructive">{errors.city}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60"
                        >
                            {processing ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ثبت سپلایر'}
                        </button>
                        <a
                            href={isEdit ? `/suppliers/${supplier!.id}` : '/suppliers'}
                            className="rounded-lg px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            انصراف
                        </a>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
