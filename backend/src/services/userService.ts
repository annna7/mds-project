import {User, type IUser, IUserWithClerk} from '../models';
import {clerkClient} from '@clerk/clerk-sdk-node';

class UserService {
	public async createUser(clerkId: string, role: string, onboardingStep: number,  profilePicture?: string): Promise<IUser | undefined> {
		try {
			const parsedRole = role === 'Landlord' ? 'landlord' : 'regularUser';
			const user = new User({ clerkId, profilePicture, role: parsedRole, onboardingStep });
			return await user.save();

		} catch (error) {
			throw new Error('Error creating user');
		}
	}

	async getAllUsers(): Promise<IUser[]> {
		return User.find();
	}

	async getUserByClerkId(clerkId: string): Promise<IUser | null> {
		return User.findOne({ clerkId });
	}

	async getUserWithClerkDetails(clerkId: string): Promise<IUserWithClerk | null> {
		const databaseUser = await this.getUserByClerkId(clerkId);
		if (!databaseUser) {
			return null;
		}
		const clerkUser = await clerkClient.users.getUser(clerkId);
		if (!clerkUser) {
			return null;
		}
		return {
			...databaseUser.toObject(),
			firstName: clerkUser.firstName,
			lastName: clerkUser.lastName,
			email: clerkUser.primaryEmailAddressId,
			nickname: clerkUser.username
		} as IUserWithClerk;
	}

	async updateUserByClerkId(clerkId: string, update: Partial<IUser>): Promise<IUser | null> {
		return User.findOneAndUpdate({ clerkId }, update, { new: true });
	}

	async deleteUserByClerkId(clerkId: string): Promise<IUser | null> {
		return User.findOneAndDelete({ clerkId });
	}
}

export const userService = new UserService();
