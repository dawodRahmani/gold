import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh w-full">
            {/* Decorative side panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[oklch(0.16_0.02_85)] text-white p-12 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(45deg, oklch(0.72 0.17 85) 0, oklch(0.72 0.17 85) 1px, transparent 0, transparent 50%)',
                        backgroundSize: '20px 20px',
                    }}
                />
                <div className="relative z-10 text-center space-y-6 max-w-md">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-[oklch(0.72_0.17_85)] flex items-center justify-center text-4xl shadow-lg">
                            ⚜
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[oklch(0.72_0.17_85)]">
                        سیستم مدیریت طلا فروشی
                    </h1>
                    <p className="text-[oklch(0.70_0_0)] text-sm leading-relaxed">
                        مدیریت خرید، فروش، امانت و حسابداری طلا در یک سیستم یکپارچه
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-right text-sm mt-8">
                        {[
                            { icon: '💰', label: 'مدیریت حسابداری' },
                            { icon: '📊', label: 'گزارشات کامل' },
                            { icon: '👥', label: 'مدیریت مشتریان' },
                            { icon: '📱', label: 'اطلاع‌رسانی واتساپ' },
                        ].map((f) => (
                            <div
                                key={f.label}
                                className="flex items-center gap-2 bg-[oklch(0.24_0.03_85)] rounded-lg px-3 py-2"
                            >
                                <span>{f.icon}</span>
                                <span className="text-[oklch(0.85_0_0)]">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Login form panel */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm space-y-8">
                    <div className="flex lg:hidden justify-center">
                        <div className="w-14 h-14 rounded-xl bg-[oklch(0.72_0.17_85)] flex items-center justify-center text-3xl">
                            ⚜
                        </div>
                    </div>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
