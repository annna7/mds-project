import { userService } from '../services';

export const UserController = {
	createUser: async (req, res) => {
		try {
			const clerkId = req.headers['x-clerk-user-id'];
			const { profilePicture, role, onboardingStep } = req.body;
			const newUser = await userService.createUser(clerkId, role, onboardingStep, profilePicture);
			res.status(201).json(newUser);
		} catch (error) {
			res.status(500).json({ error: 'Error creating user' });
		}
	},

	updateUser: async (req, res) => {
		try {
			const clerkId = req.params.clerkId;
			const updates = req.body;
			const updatedUser = await userService.updateUserByClerkId(clerkId, updates);
			console.error('updated user', updatedUser);
			updatedUser ? res.json(updatedUser) : res.status(404).json({ error: 'User not found' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error updating user' });
		}
	},

	getAllUsers: async (req, res) => {
		try {
			const users = await userService.getAllUsers();
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error fetching users' });
		}
	},

	getUser: async (req, res) => {
		try {
			const clerkId = req.params.clerkId;
			const user = await userService.getUserByClerkId(clerkId);
			user ? res.json(user) : res.status(404).json({ error: 'User not found' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error fetching user' });
		}
	},

	getFullUser: async (req, res) => {
		try {
			const clerkId = req.params.clerkId;
			const user = await userService.getUserWithClerkDetails(clerkId);
			user ? res.json(user) : res.status(404).json({ error: 'User not found' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error fetching user' });
		}
	}
};
