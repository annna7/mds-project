import { IListing, ISearchParams, Listing, Review } from '../models';
import { FilterQuery } from 'mongoose';

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

const getFilterQuery = (filters) => {
	console.error(filters);
	const query: FilterQuery<IListing> = {};

	if (filters.roomType && filters.roomType !== 'any') {
		query.type = filters.roomType;
	}

	if (filters.provider && filters.provider !== 'any') {
		if (filters.provider === 'storia') {
			query.url = { $regex: '^https://www.storia' };
		} else if (filters.provider === 'olx') {
			query.url = { $regex: '^https://www.olx' };
		} else if (filters.provider === 'internal') {
			query.url = { $not: { $regex: '^https://www.storia|^https://www.olx' } };
		}
	}

	if (filters.priceRange) {
		query.price = { $gte: filters.priceRange.min, $lte: filters.priceRange.max };
	}

	if (filters.bedrooms !== undefined && filters.bedrooms !== 0) {
		query.numberOfRooms = filters.bedrooms === 4 ? { $gte: filters.bedrooms } : filters.bedrooms;
	}

	if (filters.bathrooms !== undefined && filters.bathrooms !== 0) {
		query.numberOfBathrooms = filters.bathrooms === 3 ? { $gte: filters.bathrooms } : filters.bathrooms;
	}

	if (filters.amenities && filters.amenities.length > 0) {
		query.amenities = { $all: filters.amenities };
	}

	return query;
};

export const SearchService = {
	search: async (searchParams: ISearchParams) => {
		const geoQuery = getGeospatialQuery(searchParams);
		const filterQuery = getFilterQuery(searchParams.filters);
		const combinedQuery = { ...geoQuery, ...filterQuery };
		const restrictedListings = await Listing.find(combinedQuery);
		const restrictedReviews = await Review.find(combinedQuery);
		const justFilteredListings = await Listing.find(filterQuery);
		const justFilteredReviews = await Review.find(filterQuery);
		return {
			listings: restrictedListings,
			reviews: restrictedReviews,
			filteredListings: justFilteredListings,
			filteredReviews: justFilteredReviews
		};
	}
};