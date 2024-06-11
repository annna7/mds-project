import { IAddress, ILocation } from '.';

export interface IReview {
	_id: string,
	reviewerId: string,
	rating: number,
	content: string,
	location: ILocation,
	address: IAddress,
	areaFeedback: object,
	buildingFeedback: object,
	tags: string[],
	createdAt: Date,
	updatedAt: Date,
}
