import mongoose, { Schema, model, models } from 'mongoose';

export type UserRole = 'PATEL_ADMIN' | 'COMPANY_ADMIN' | 'COMPANY_USER';

export interface IUser {
    _id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    companyId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['PATEL_ADMIN', 'COMPANY_ADMIN', 'COMPANY_USER'],
            default: 'COMPANY_USER',
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1 });

export default models.User || model<IUser>('User', UserSchema);
