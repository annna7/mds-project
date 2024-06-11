import { useEffect, useState } from 'react';
import { listingService } from '../services';
import { IListing } from '../models';

export const useListings = () => {
	const [listings, setListings] = useState<IListing[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		setIsLoading(true);
		listingService.getAllListings()
			.then(data => {
				setListings(data);
				setIsLoading(false);
			})
			.catch(err => {
				setError(err);
				setIsLoading(false);
			});
	}, []);

	return { listings, isLoading, error };
};
