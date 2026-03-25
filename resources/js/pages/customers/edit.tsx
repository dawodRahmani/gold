import { Head } from '@inertiajs/react';
import CustomerForm from '@/components/customers/customer-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Customer } from '@/types';

type Props = { customer: Customer };

export default function CustomersEdit({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'داشبورد', href: '/dashboard' },
        { title: 'مشتریان', href: '/customers' },
        { title: customer.name, href: `/customers/${customer.id}` },
        { title: 'ویرایش', href: `/customers/${customer.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`ویرایش — ${customer.name}`} />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                <div>
                    <h1 className="text-xl font-bold">ویرایش مشتری</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {customer.name}
                    </p>
                </div>
                <CustomerForm initialData={customer} isEdit />
            </div>
        </AppLayout>
    );
}
