import { Schema } from 'mongoose';

interface IAddress {
	streetNumber: string,
	streetName: string,
	city: string,
	stateOrProvince: string,
	postalCode: string,
	country: string,
}

const AddressSchema = new Schema<IAddress>({
	streetNumber: { type: String, required: true },
	streetName: { type: String, required: true },
	city: { type: String, required: true },
	stateOrProvince: { type: String, required: true },
	postalCode: { type: String, required: true },
	country: { type: String, required: true }
}, { _id: false });

export { IAddress, AddressSchema };