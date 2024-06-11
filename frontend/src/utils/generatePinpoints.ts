import { I2DPoint } from '../models';
import { BUCHAREST_COORDINATES } from './constants';

const generatePerimeterCoordinates = (center, radius, numPoints): I2DPoint[] => {
	const points: I2DPoint[] = [];
	for (let i = 0; i < numPoints; i++) {
		const angle = Math.random() * 2 * Math.PI;
		const randomRadius = Math.sqrt(Math.random()) * radius;
		const latitude = center.latitude + randomRadius * Math.cos(angle);
		const longitude = center.longitude + randomRadius * Math.sin(angle);
		points.push({
			'latitude': latitude,
			'longitude': longitude,
		});
	}
	return points;
};

const radius = 0.08;

export const pins= generatePerimeterCoordinates(BUCHAREST_COORDINATES, radius, 30);


