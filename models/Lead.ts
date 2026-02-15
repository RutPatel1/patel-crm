import mongoose, { Schema, model, models } from 'mongoose';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
export type LeadSource = 'Website' | 'Referral' | 'Cold Call' | 'Email' | 'Trade Show' | 'Other';

export interface ILead {
    _id: string;
    companyId: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
    status: LeadStatus;
    value?: number;
    source?: LeadSource;
    assignedTo?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Lead name is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        jobTitle: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'],
            default: 'NEW',
        },
        value: {
            type: Number,
            min: 0,
        },
        source: {
            type: String,
            enum: ['Website', 'Referral', 'Cold Call', 'Email', 'Trade Show', 'Other'],
            default: 'Other',
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

LeadSchema.index({ companyId: 1, status: 1 });
LeadSchema.index({ companyId: 1, createdAt: -1 });

export default models.Lead || model<ILead>('Lead', LeadSchema);
