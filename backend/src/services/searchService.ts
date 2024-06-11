import { ISearchParams, Listing, Review } from '../models';

const getGeospatialQuery = ({ region }) => {
	const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

	// we consider Earth to be flat to simplify computation, which is fine for small regions
	const north = latitude + latitudeDelta / 2;
	const south = latitude - latitudeDelta / 2;
	const east = longitude + longitudeDelta / 2;
	const west = longitude - longitudeDelta / 2;

	return {
		location: {
			$geoWithin: {
				$box: [
					[west, south], // bottom-left corner
					[east, north]  // top-right corner
				]
			}
		}
	};
};

export const SearchService = {
	search: async (searchParams: ISearchParams) => {
		const query = getGeospatialQuery(searchParams);
		try {
			const restrictedListings = await Listing.find(query);
			const restrictedReviews = await Review.find(query);
			const allListings = await Listing.find({});
			const allReviews = await Review.find({});
			return {
				listings: restrictedListings,
				reviews: restrictedReviews,
				filteredListings: allListings,
				filteredReviews: allReviews
			};
		} catch (error) {
			console.error('Error fetching data:', error);
			throw error;
		}
	}
};
