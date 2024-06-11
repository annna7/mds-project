import { Schema, type Document, model } from 'mongoose';

interface IUser extends Document {
    clerkId: string,
    profilePicture: string,
    role: 'regularUser' | 'landlord',
    onboardingStep: number,
    createdAt: Date,
    updatedAt: Date,
}

type IUserWithClerk = IUser & {
    firstName: string,
    lastName: string,
    email: string,
    nickname: string,
};

const UserSchema = new Schema<IUser>({
	clerkId: { type: String, required: true },
	profilePicture: { type: String },
	onboardingStep: { type: Number, required: true, default: 1, min: 1, max: 3},
	role: { type: String, required: true, enum: ['regularUser', 'landlord'] }
},
{ timestamps: true });

const User = model<IUser>('User', UserSchema);
export { UserSchema, type IUser, type IUserWithClerk, User };
