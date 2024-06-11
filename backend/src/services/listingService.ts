import { Listing, IListing } from '../models';
import { FilterQuery, UpdateQuery } from 'mongoose';

export const ListingService = {
	createListing: async (listingData: IListing): Promise<IListing> => {
		const listing = new Listing(listingData);
		return listing.save();
	},

	getListingById: async (id: string): Promise<IListing | null> => {
		return Listing.findById(id).exec();
	},

	getAllListings: async (filter: FilterQuery<IListing> = {}): Promise<IListing[]> => {
		return Listing.find(filter).exec();
	},

	updateListingById: async (id: string, updateData: UpdateQuery<IListing>): Promise<IListing | null> => {
		return Listing.findByIdAndUpdate(id, updateData, { new: true }).exec();
	},

	deleteListingById: async (id: string): Promise<IListing | null> => {
		return Listing.findByIdAndDelete(id).exec();
	}
};
