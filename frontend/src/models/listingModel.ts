import { ILocation } from '.';

export interface IListing {
    _id: string,
    landlordId?: string,
    title: string,
    description?: string,
    photos: string[],
    address: string,
    location: ILocation,
    type: string,
    price: number,
    numberOfRooms: number,
    numberOfBathrooms: number,
    size: number,
    external: boolean,
    url?: string,
    amenities: string[],
    createdAt: Date,
    updatedAt: Date,
}