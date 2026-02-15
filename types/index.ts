export interface User {
    id: string;
    name: string;
    email: string;
    role: 'PATEL_ADMIN' | 'COMPANY_ADMIN' | 'COMPANY_USER';
    companyId?: string;
    companyName?: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Lead {
    _id: string;
    companyId: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
    value?: number;
    source?: 'Website' | 'Referral' | 'Cold Call' | 'Email' | 'Trade Show' | 'Other';
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Company {
    _id: string;
    name: string;
    domain?: string;
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    userCount?: number;
    createdAt: string;
    updatedAt: string;
}
