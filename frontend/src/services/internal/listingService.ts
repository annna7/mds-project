import { callApi } from '../../utils';
import { useUser } from '@clerk/clerk-expo';

export const listingService = {
	createListing: (data: any, userId: string) => {
		return callApi('listings', { method: 'POST', body: data }, userId);
	},

	getListing: (id: string, userId: string) => {
		return callApi(`listings/${id}`, {}, userId);
	},

	getAllListings: () => {
		return callApi('listings');
	},

	updateListing: (id: string, data: any, userId: string) => {
		return callApi(`listings/${id}`, { method: 'PUT', body: data }, userId);
	},

	deleteListing: (id: string, userId: string) => {
		return callApi(`listings/${id}`, { method: 'DELETE' }, userId);
	}
};
