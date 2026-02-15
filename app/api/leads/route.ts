import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { requireAuth } from '@/middleware/auth';

// GET - List all leads for the user's company
export const GET = requireAuth(async (request: NextRequest, user: any) => {
    try {
        await dbConnect();

        if (user.role === 'PATEL_ADMIN') {
            return NextResponse.json(
                { error: 'Admin cannot access customer leads data' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const source = searchParams.get('source');

        let query: any = { companyId: user.companyId };

        if (status) {
            query.status = status;
        }

        if (source) {
            query.source = source;
        }

        const leads = await Lead.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, leads });
    } catch (error: any) {
        console.error('Get leads error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads', details: error.message },
            { status: 500 }
        );
    }
});

// POST - Create new lead
export const POST = requireAuth(async (request: NextRequest, user: any) => {
    try {
        await dbConnect();

        if (user.role === 'PATEL_ADMIN') {
            return NextResponse.json(
                { error: 'Admin cannot create customer leads' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const lead = await Lead.create({
            ...data,
            companyId: user.companyId,
        });

        return NextResponse.json(
            { success: true, lead },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create lead error:', error);
        return NextResponse.json(
            { error: 'Failed to create lead', details: error.message },
            { status: 500 }
        );
    }
});
