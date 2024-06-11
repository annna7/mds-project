import { Schema } from 'mongoose';

interface ILocation {
	type: string,
	coordinates: number[],
}

const LocationSchema = new Schema<ILocation>({
	type: {
		type: String,
		enum: ['Point'],
		required: true,
		default: 'Point'
	},
	coordinates: {
		type: [Number],
		required: true,
		index: '2dsphere'
	}
}, { _id: false });

export { LocationSchema, ILocation };