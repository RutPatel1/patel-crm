'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'PATEL_ADMIN')) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'PATEL_ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navbar */}
            <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-white">PatelCRM Admin</h1>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                                Super Admin
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-white text-sm">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-pink-100">Administrator</div>
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
