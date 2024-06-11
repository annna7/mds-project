import { Schema, type Document, model, type SchemaDefinitionProperty } from 'mongoose';
import { type IUser, type IListing, type IReview } from '../models';

interface IMessage extends Document {
    senderId: IUser['_id'],
    receiverId: IUser['_id'],
    content: string,
    isRead: boolean,
    referenceId: SchemaDefinitionProperty<IListing['_id']> | SchemaDefinitionProperty<IReview['_id']>,
    type: 'listing' | 'review',
    createdAt: Date,
    updatedAt: Date,
}

const MessageSchema = new Schema<IMessage>({
	senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	isRead: { type: Boolean, required: true },
	referenceId: { type: Schema.Types.ObjectId, required: true },
	type: { type: String, required: true, enum: ['listing', 'review'] }
}, { timestamps: true });

const Message = model<IMessage>('Message', MessageSchema);
export { MessageSchema, type IMessage, Message };
