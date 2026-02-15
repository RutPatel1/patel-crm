import mongoose, { Schema, model, models } from 'mongoose';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export interface IActivity {
    _id: string;
    companyId: mongoose.Types.ObjectId;
    leadId?: mongoose.Types.ObjectId;
    contactId?: mongoose.Types.ObjectId;
    type: ActivityType;
    description: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
    {
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true,
        },
        leadId: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
        },
        contactId: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
        },
        type: {
            type: String,
            enum: ['call', 'email', 'meeting', 'note', 'task'],
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ActivitySchema.index({ companyId: 1, createdAt: -1 });
ActivitySchema.index({ leadId: 1 });

export default models.Activity || model<IActivity>('Activity', ActivitySchema);
