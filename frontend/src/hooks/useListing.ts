import { useEffect, useState } from 'react';
import { listingService } from '../services';
import { IListing } from '../models';

export const useListing = (listingId: string, userId: string) => {
	const [listing, setListing] = useState<IListing>();
	const [error, setError] = useState(null);

	useEffect(() => {
		listingService.getListing(listingId, userId)
			.then(data => {
				setListing(data);
			})
			.catch(err => {
				setError(err);
			});
	}, []);

	return { listing, error };
};
