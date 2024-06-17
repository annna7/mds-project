import { FilterQuery } from 'mongoose';
import { ISearchStrategy } from './ISearchStrategy';
import { IListing, IReview, ISearchParams } from '../models';

export async function applyStrategyToEntity<T>(
	entityModel: any, // This should be a Mongoose model like Listing or Review
	strategy: ISearchStrategy,
	params: any
): Promise<T[]> {
	const query: FilterQuery<IReview | IListing> = strategy.getQuery(params);
	try {
		return await entityModel.find(query);
	} catch (error) {
		console.error('Error applying strategy to entity:', error);
		throw error;
	}
}

export async function applyCombinedStrategies<T>(
	entityModel: any,
	geoStrategy: ISearchStrategy,
	filterStrategy: ISearchStrategy,
	params: ISearchParams
): Promise<T[]> {
	const geoQuery = geoStrategy.getQuery(params);
	const filterQuery = filterStrategy.getQuery(params.filters);
	const combinedQuery = { ...geoQuery, ...filterQuery };

	try {
		return await entityModel.find(combinedQuery);
	} catch (error) {
		console.error('Error applying combined strategies:', error);
		throw error;
	}
}