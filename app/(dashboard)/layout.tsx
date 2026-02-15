'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user?.role === 'PATEL_ADMIN') {
            router.push('/admin/companies');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-white">PatelCRM</h1>
                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => router.push('/leads')}
                                    className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Leads
                                </button>
                                <button
                                    onClick={() => router.push('/reports')}
                                    className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Reports
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-white text-sm">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-blue-200">{user.companyName}</div>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
