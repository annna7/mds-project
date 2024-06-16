import { type IUser, type ILocation, type IAddress, LocationSchema, AddressSchema } from '../models';
import { Schema, model, type Document } from 'mongoose';

interface IReview extends Document {
    reviewerId: IUser['_id'],
    rating: number,
    content: string,
	location: ILocation,
	address: IAddress,
    areaFeedback: object,
    buildingFeedback: object,
    tags: [string],
    createdAt: Date,
    updatedAt: Date,
}

const ReviewSchema = new Schema<IReview>({
	reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	rating: { type: Number, required: true },
	content: { type: String, required: true },
	address: { type: AddressSchema, required: true },
	location: { type: LocationSchema, required: true },
	areaFeedback: { type: Schema.Types.Mixed, required: true },
	buildingFeedback: { type: Object, required: true },
	tags: { type: [String] }
}, { timestamps: true });

const Review = model<IReview>('Review', ReviewSchema);
export { ReviewSchema, type IReview, Review };
