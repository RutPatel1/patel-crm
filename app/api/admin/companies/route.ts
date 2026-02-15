import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import User from '@/models/User';
import { requireRole } from '@/middleware/auth';
import bcrypt from 'bcryptjs';

// GET - List all companies (PATEL_ADMIN only)
export const GET = requireRole(['PATEL_ADMIN'])(async (request: NextRequest, user: any) => {
    try {
        await dbConnect();

        const companies = await Company.find()
            .sort({ createdAt: -1 })
            .lean();

        // Get user count for each company
        const companiesWithStats = await Promise.all(
            companies.map(async (company) => {
                const userCount = await User.countDocuments({ companyId: company._id });
                return {
                    ...company,
                    userCount,
                };
            })
        );

        return NextResponse.json({ success: true, companies: companiesWithStats });
    } catch (error: any) {
        console.error('Get companies error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch companies', details: error.message },
            { status: 500 }
        );
    }
});

// POST - Create new company and admin user (PATEL_ADMIN only)
export const POST = requireRole(['PATEL_ADMIN'])(async (request: NextRequest, user: any) => {
    try {
        await dbConnect();

        const { companyName, adminName, adminEmail, adminPassword } = await request.json();

        if (!companyName || !adminName || !adminEmail || !adminPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create company
        const company = await Company.create({
            name: companyName,
            subscriptionStatus: 'active',
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        const adminUser = await User.create({
            name: adminName,
            email: adminEmail.toLowerCase(),
            password: hashedPassword,
            role: 'COMPANY_ADMIN',
            companyId: company._id,
        });

        return NextResponse.json(
            {
                success: true,
                company,
                admin: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create company error:', error);
        return NextResponse.json(
            { error: 'Failed to create company', details: error.message },
            { status: 500 }
        );
    }
});
