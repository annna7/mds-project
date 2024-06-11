import { IAddress, ILocation } from '.';

export interface IListing {
	_id: string,
	landlordId: string,
	title: string,
	description: string,
	photos: string[],
	address: IAddress,
	location: ILocation,
	type: string,
	price: number,
	numberOfRooms: number,
	numberOfBathrooms: number,
	size: number,
	amenities: string[],
	createdAt: Date,
	updatedAt: Date,
}
