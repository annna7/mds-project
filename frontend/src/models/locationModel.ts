export interface ILocation {
	type: string,
	coordinates: number[],
}

export interface I2DPoint {
	latitude: number,
	longitude: number,
}

export type IRegion = I2DPoint & {
	latitudeDelta: number,
	longitudeDelta: number,
};
