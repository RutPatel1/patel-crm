import mongoose, { Schema, model, models } from 'mongoose';

export interface IContact {
    _id: string;
    companyId: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    company?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Contact name is required'],
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
        jobTitle: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        tags: [{
            type: String,
            trim: true,
        }],
    },
    {
        timestamps: true,
    }
);

ContactSchema.index({ companyId: 1 });

export default models.Contact || model<IContact>('Contact', ContactSchema);
