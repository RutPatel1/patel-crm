import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import User from '@/models/User';
import Lead from '@/models/Lead';
import Contact from '@/models/Contact';
import Activity from '@/models/Activity';
import { requireRole } from '@/middleware/auth';

// DELETE - Delete company and all associated data (PATEL_ADMIN only)
export const DELETE = requireRole(['PATEL_ADMIN'])(
    async (request: NextRequest, user: any, { params }: { params: { id: string } }) => {
        try {
            await dbConnect();

            const companyId = params.id;

            // Delete all associated data
            await Promise.all([
                User.deleteMany({ companyId }),
                Lead.deleteMany({ companyId }),
                Contact.deleteMany({ companyId }),
                Activity.deleteMany({ companyId }),
            ]);

            // Delete company
            const company = await Company.findByIdAndDelete(companyId);

            if (!company) {
                return NextResponse.json(
                    { error: 'Company not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Company and all associated data deleted successfully',
            });
        } catch (error: any) {
            console.error('Delete company error:', error);
            return NextResponse.json(
                { error: 'Failed to delete company', details: error.message },
                { status: 500 }
            );
        }
    }
);
