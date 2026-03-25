import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, Building2, ArrowLeftRight, Calculator, Landmark, BarChart3, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'داشبورد', href: dashboard(), icon: LayoutGrid },
    { title: 'مشتریان', href: '/customers', icon: Users },
    { title: 'سپلایرها', href: '/suppliers', icon: Building2 },
    { title: 'تراکنش‌ها', href: '/transactions', icon: ArrowLeftRight },
    { title: 'ماشین حساب', href: '/calculator', icon: Calculator },
    { title: 'حساب‌ها', href: '/accounts', icon: Landmark },
    { title: 'گزارشات', href: '/reports', icon: BarChart3 },
    { title: 'تنظیمات', href: '/store-settings', icon: Settings },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" side="right">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
