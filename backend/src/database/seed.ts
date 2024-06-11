import { USERS, LISTINGS } from './seeds';
import { Listing } from '../models';

const seedUsers = async () => {
	for (const user of USERS) {
		await user.save();
	}
};

const seedListings = async () => {
	await Listing.deleteMany({});
	for (const listing of LISTINGS) {
		await listing.save();
	}
};

export const seedDatabase = async () => {
	try {
		// await seedUsers();
		await seedListings();
		console.log('Database seeding successful');
	} catch (error) {
		console.error('Database seeding failed');
	}
};
