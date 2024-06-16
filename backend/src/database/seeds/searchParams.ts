import {ISearchParams} from '../../models';

export const mockSearchParams: ISearchParams = {
	region: {
		longitudeDelta: 0.08473265916109085,
		latitudeDelta: 0.0919914678717646,
		longitude: 26.09629997983575,
		latitude: 44.43228183129124
	},
	filters: {
		roomType: 'any',
		providerType: 'any',
		priceRange: { min: 100,  max: 3000},
		bedrooms: 0,
		bathrooms: 0,
		amenities: [],
		shouldSearch: false,
	},
};