import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { name, email, password, companyName, role } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        let company = null;
        let userRole = role || 'COMPANY_ADMIN';

        // If not a Patel admin, create or associate with company
        if (userRole !== 'PATEL_ADMIN') {
            if (!companyName) {
                return NextResponse.json(
                    { error: 'Company name is required for customer signup' },
                    { status: 400 }
                );
            }

            // Create new company
            company = await Company.create({
                name: companyName,
                subscriptionStatus: 'trial',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: userRole,
            companyId: company?._id,
        });

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            companyId: company?._id.toString() || '',
        });

        return NextResponse.json(
            {
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    companyId: company?._id,
                    companyName: company?.name,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create account', details: error.message },
            { status: 500 }
        );
    }
}
