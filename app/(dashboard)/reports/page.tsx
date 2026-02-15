'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [insights, setInsights] = useState('');

    const generateReport = async () => {
        setLoading(true);
        setError('');
        setInsights('');

        try {
            const response = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to generate report');
            }

            const data = await response.json();
      set Insights(data.insights);

            // Generate PDF
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(30, 64, 175); // Blue
            doc.text('PatelCRM Lead Analysis Report', 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Company: ${user?.companyName}`, 14, 28);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 33);
            doc.text(`Total Leads: ${data.metadata.totalLeads}`, 14, 38);

            // AI Insights
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('AI-Powered Insights', 14, 50);

            doc.setFontSize(10);
            doc.setTextColor(60);
            const splitInsights = doc.splitTextToSize(data.insights, 180);
            doc.text(splitInsights, 14, 58);

            // Calculate Y position for table
            const insightsHeight = splitInsights.length * 5;
            const tableStartY = 65 + insightsHeight;

            // Leads Table
            if (tableStartY < 280) { // Check if there's space
                autoTable(doc, {
                    startY: tableStartY,
                    head: [['Name', 'Company', 'Status', 'Value', 'Source']],
                    body: data.leads.map((lead: any) => [
                        lead.name,
                        lead.company || '-',
                        lead.status,
                        lead.value ? `$${lead.value.toLocaleString()}` : '-',
                        lead.source || '-',
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246] },
                });
            }

            // Save PDF
            doc.save(`PatelCRM_Report_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Lead Reports</h1>
                <p className="text-gray-600 mt-1">Generate AI-powered insights and PDF reports for your leads data.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6">
                            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Comprehensive Report</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our AI analyzes your lead data to provide actionable insights including lead status distribution,
                            revenue potential, source performance, and strategic recommendations.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg inline-block">
                            {error}
                        </div>
                    )}

                    {insights && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-4xl mx-auto">
                            <h3 className="font-bold text-blue-900 mb-3">AI Analysis:</h3>
                            <div className="text-gray-700 whitespace-pre-wrap text-sm">{insights}</div>
                        </div>
                    )}

                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Generating Report...</span>
                            </span>
                        ) : (
                            <span className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Generate & Download PDF Report</span>
                            </span>
                        )}
                    </button>

                    <p className="text-sm text-gray-500">
                        Report includes AI insights, lead statistics, and detailed lead table
                    </p>
                </div>
            </div>
        </div>
    );
}
