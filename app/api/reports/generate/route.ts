import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { requireAuth } from '@/middleware/auth';
import { generateLeadReport } from '@/lib/gemini';

// POST - Generate AI report for user's leads
export const POST = requireAuth(async (request: NextRequest, user: any) => {
    try {
        await dbConnect();

        if (user.role === 'PATEL_ADMIN') {
            return NextResponse.json(
                { error: 'Admin cannot generate customer reports' },
                { status: 403 }
            );
        }

        // Fetch all leads for the user's company
        const leads = await Lead.find({ companyId: user.companyId })
            .populate('assignedTo', 'name email')
            .lean();

        if (leads.length === 0) {
            return NextResponse.json(
                { error: 'No leads found to generate report' },
                { status: 404 }
            );
        }

        // Generate AI insights
        const aiInsights = await generateLeadReport(leads);

        // Return data for client-side PDF generation
        return NextResponse.json({
            success: true,
            insights: aiInsights,
            leads,
            metadata: {
                totalLeads: leads.length,
                companyId: user.companyId,
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        console.error('Generate report error:', error);
        return NextResponse.json(
            { error: 'Failed to generate report', details: error.message },
            { status: 500 }
        );
    }
});
