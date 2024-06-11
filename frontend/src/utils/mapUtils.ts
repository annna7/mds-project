import { ILocation } from '../models';

export const getCoordinatesFromLocation = (location: ILocation) => {
	return {
		'latitude': location.coordinates[1],
		'longitude': location.coordinates[0]
	};
};