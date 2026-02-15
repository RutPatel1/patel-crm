import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// This endpoint creates a PatelCRM admin user
// For security, you should delete this file after creating your admin user
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email, password, name } = await request.json();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const admin = await User.create({
            email,
            password: hashedPassword,
            name,
            role: 'PATEL_ADMIN',
            companyId: null, // No company for PatelCRM admin
        });

        return NextResponse.json(
            {
                success: true,
                message: 'PatelCRM Admin created successfully',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create admin error:', error);
        return NextResponse.json(
            { error: 'Failed to create admin', details: error.message },
            { status: 500 }
        );
    }
}
