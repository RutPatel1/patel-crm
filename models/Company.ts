import mongoose, { Schema, model, models } from 'mongoose';

export interface ICompany {
    _id: string;
    name: string;
    domain?: string;
    subscriptionStatus: 'active' | 'inactive' | 'trial';
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        domain: {
            type: String,
            trim: true,
        },
        subscriptionStatus: {
            type: String,
            enum: ['active', 'inactive', 'trial'],
            default: 'trial',
        },
    },
    {
        timestamps: true,
    }
);

export default models.Company || model<ICompany>('Company', CompanySchema);
