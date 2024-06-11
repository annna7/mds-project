import { Schema, type Document, model } from 'mongoose';
import { AddressSchema, LocationSchema, type IAddress, type ILocation, type IUser } from '../models';

interface IListing extends Document {
    landlordId: IUser['_id'],
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

const ListingSchema = new Schema<IListing>({
	landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	photos: { type: [String], required: true },
	address: { type: AddressSchema, required: true },
	location: { type: LocationSchema, required: true },
	price: { type: Number, required: true },
	numberOfRooms: { type: Number, required: true },
	numberOfBathrooms: { type: Number, required: true },
	size: { type: Number, required: true },
	amenities: { type: [String], required: true }
}, { timestamps: true });

const Listing = model<IListing>('Listing', ListingSchema);
export { ListingSchema, type IListing, Listing };
