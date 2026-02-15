import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
    user?: TokenPayload;
}

export async function authMiddleware(request: NextRequest): Promise<TokenPayload | null> {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        return decoded;
    } catch (error) {
        return null;
    }
}

export function requireAuth(handler: (request: NextRequest, user: TokenPayload, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any) => {
        const user = await authMiddleware(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return handler(request, user, context);
    };
}

export function requireRole(roles: string[]) {
    return (handler: (request: NextRequest, user: TokenPayload, context?: any) => Promise<NextResponse>) => {
        return requireAuth(async (request: NextRequest, user: TokenPayload, context?: any) => {
            if (!roles.includes(user.role)) {
                return NextResponse.json(
                    { error: 'Forbidden: Insufficient permissions' },
                    { status: 403 }
                );
            }

            return handler(request, user, context);
        });
    };
}
