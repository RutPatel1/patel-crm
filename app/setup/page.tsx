'use client';

import { useState } from 'react';

export default function SetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const createAdmin = async () => {
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/auth/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@patelcrm.com',
                    password: 'pateladmin123',
                    name: 'PatelCRM Administrator',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Admin account created successfully!');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to create admin account');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to create admin account');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">PatelCRM Setup</h1>
                        <p className="text-purple-200">Create your admin account</p>
                    </div>

                    {status === 'idle' && (
                        <div className="space-y-6">
                            <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4 text-purple-100 text-sm">
                                <p className="font-semibold mb-2">This will create:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Email: admin@patelcrm.com</li>
                                    <li>Password: pateladmin123</li>
                                    <li>Role: PatelCRM Admin</li>
                                </ul>
                            </div>

                            <button
                                onClick={createAdmin}
                                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all text-lg"
                            >
                                Create Admin Account
                            </button>

                            <p className="text-xs text-purple-200 text-center">
                                ⚠️ After setup, delete /app/setup for security
                            </p>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <p className="text-white mt-4">Creating admin account...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-6 text-center">
                                <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-green-100 font-semibold text-lg mb-2">{message}</p>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 text-white text-sm space-y-2">
                                <p className="font-semibold">Login Credentials:</p>
                                <p>📧 Email: <span className="text-purple-300">admin@patelcrm.com</span></p>
                                <p>🔑 Password: <span className="text-purple-300">pateladmin123</span></p>
                            </div>

                            <a
                                href="/login"
                                className="block w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg text-center shadow-lg transform hover:scale-105 transition-all"
                            >
                                Go to Login →
                            </a>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
                                <p className="text-red-100 font-semibold mb-2">Error:</p>
                                <p className="text-red-200 text-sm">{message}</p>
                            </div>

                            <button
                                onClick={createAdmin}
                                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition"
                            >
                                Try Again
                            </button>

                            {message.includes('already exists') && (
                                <a
                                    href="/login"
                                    className="block w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-center transition border border-white/20"
                                >
                                    Go to Login →
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
