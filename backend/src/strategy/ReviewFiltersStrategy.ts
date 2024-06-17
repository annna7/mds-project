import { IReview, ISearchParams } from '../models'; // Assuming these are defined appropriately
import { FilterQuery } from 'mongoose';
import { ISearchStrategy } from './ISearchStrategy';

export class ReviewFiltersStrategy implements ISearchStrategy {
	getQuery(filters): FilterQuery<IReview> {
		const query: FilterQuery<IReview> = {};

		if (filters.recommend && filters.recommend != -1) {
			query.recommend = { $eq: filters.recommend };
		}

		console.error('REVIEwS', query);

		return query;
	}
}
