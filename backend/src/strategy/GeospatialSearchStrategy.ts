import { IListing, IReview, ISearchParams } from '../models';
import { FilterQuery } from 'mongoose';
import { ISearchStrategy } from './ISearchStrategy';

export class GeospatialSearchStrategy implements ISearchStrategy {
	getQuery({ region }: ISearchParams): FilterQuery<IListing | IReview> {
		const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
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
	}
}
