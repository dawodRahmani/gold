import { Head } from '@inertiajs/react';
import CustomerForm from '@/components/customers/customer-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'داشبورد', href: '/dashboard' },
    { title: 'مشتریان', href: '/customers' },
    { title: 'مشتری جدید', href: '/customers/create' },
];

export default function CustomersCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مشتری جدید" />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                <div>
                    <h1 className="text-xl font-bold">مشتری جدید</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        معلومات مشتری را وارد کنید
                    </p>
                </div>
                <CustomerForm />
            </div>
        </AppLayout>
    );
}
