'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lead } from '@/types';

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        qualified: 0,
        won: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/leads', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLeads(data.leads);

                // Calculate stats
                const stats = data.leads.reduce((acc: any, lead: Lead) => {
                    acc.total++;
                    if (lead.status === 'NEW') acc.new++;
                    if (lead.status === 'QUALIFIED') acc.qualified++;
                    if (lead.status === 'WON') acc.won++;
                    return acc;
                }, { total: 0, new: 0, qualified: 0, won: 0 });

                setStats(stats);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your leads today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="text-sm font-medium text-gray-600">Total Leads</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="text-sm font-medium text-gray-600">New Leads</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stats.new}</div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div className="text-sm font-medium text-gray-600">Qualified</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stats.qualified}</div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="text-sm font-medium text-gray-600">Won</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stats.won}</div>
                </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
                </div>
                <div className="p-6">
                    {leads.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No leads yet. Start by adding your first lead!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leads.slice(0, 5).map((lead) => (
                                <div
                                    key={lead._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-900">{lead.name}</div>
                                        <div className="text-sm text-gray-600">{lead.company || 'No company'}</div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${lead.status === 'WON' ? 'bg-green-100 text-green-800' :
                                                lead.status === 'QUALIFIED' ? 'bg-purple-100 text-purple-800' :
                                                    lead.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {lead.status}
                                        </span>
                                        {lead.value && (
                                            <span className="text-sm font-medium text-gray-700">
                                                ${lead.value.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
