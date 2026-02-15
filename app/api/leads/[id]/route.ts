import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { requireAuth } from '@/middleware/auth';

// GET - Get single lead
export const GET = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
    try {
        await dbConnect();

        const lead = await Lead.findOne({
            _id: params.id,
            companyId: user.companyId,
        }).populate('assignedTo', 'name email');

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, lead });
    } catch (error: any) {
        console.error('Get lead error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lead', details: error.message },
            { status: 500 }
        );
    }
});

// PUT - Update lead
export const PUT = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
    try {
        await dbConnect();

        if (user.role === 'PATEL_ADMIN') {
            return NextResponse.json(
                { error: 'Admin cannot update customer leads' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const lead = await Lead.findOneAndUpdate(
            { _id: params.id, companyId: user.companyId },
            data,
            { new: true, runValidators: true }
        );

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, lead });
    } catch (error: any) {
        console.error('Update lead error:', error);
        return NextResponse.json(
            { error: 'Failed to update lead', details: error.message },
            { status: 500 }
        );
    }
});

// DELETE - Delete lead
export const DELETE = requireAuth(async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
    try {
        await dbConnect();

        if (user.role === 'PATEL_ADMIN') {
            return NextResponse.json(
                { error: 'Admin cannot delete customer leads' },
                { status: 403 }
            );
        }

        const lead = await Lead.findOneAndDelete({
            _id: params.id,
            companyId: user.companyId,
        });

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error: any) {
        console.error('Delete lead error:', error);
        return NextResponse.json(
            { error: 'Failed to delete lead', details: error.message },
            { status: 500 }
        );
    }
});
