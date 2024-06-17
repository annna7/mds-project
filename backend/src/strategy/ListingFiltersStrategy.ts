import { ISearchStrategy } from './ISearchStrategy';
import { IListing, ISearchParams } from '../models';
import { FilterQuery } from 'mongoose';

export class ListingFiltersStrategy implements ISearchStrategy {
	getQuery(filters: any): FilterQuery<IListing> {
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

		console.error(query);
		return query;
	}
}
