import { USERS, LISTINGS } from './seeds';
import { Listing } from '../models';

const seedUsers = async () => {
	for (const user of USERS) {
		await user.save();
	}
};

const seedListings = async () => {
	const listingsNum = await Listing.countDocuments();
	if (!listingsNum) {
		for (const listing of LISTINGS) {
			await listing.save();
		}
	}
};

export const seedDatabase = async () => {
	try {
		await seedListings();
		console.log('Database seeding successful');
	} catch (error) {
		console.error(`Database seeding failed ${error}`);
	}
};
