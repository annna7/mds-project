import { GOOGLE_MAPS_API_KEY } from '@env';
import axios from 'axios';
import { IRegion } from '../../models';

export const getCoordinatesFromAddress = async (address: string) => {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

	const response = await axios.get(url);
	if (response.data.status === 'OK' && response.data.results.length > 0) {
		const answer = response.data.results[0].geometry;
		const { lat, lng } = answer.location;
		const { northeast, southwest } = answer.viewport;

		const latitudeDelta = Math.abs(northeast.lat - southwest.lat);
		const longitudeDelta = Math.abs(northeast.lng - southwest.lng);

		return {
			latitude: parseFloat(lat),
			longitude: parseFloat(lng),
			latitudeDelta: latitudeDelta,
			longitudeDelta: longitudeDelta,
		} as IRegion;
	} else {
		throw new Error('Could not get coordinates');
	}
};

