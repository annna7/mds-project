
import chaiHttp from 'chai-http';
import { config } from '../../src/configure';

const photos = ['https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart1.jpeg?alt=media&token=ef9567f0-aa4f-4370-a207-7afc1c22f022',
	'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart2.jpeg?alt=media&token=b08cc3a8-f2b9-4a75-a8f6-4fa4ee7467c4'];

import chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
const { expect } = chai;
const landlordId = '663cb48ee88f928f9cb35f69';
import {Listing} from '../src/models/listing';

describe('Listing Model', () => {
	let listingMock;

	before(() => {
		// Setup a mock for Listing
		listingMock = sinon.mock(Listing);
	});

	after(() => {
		// Restore the mock
		listingMock.restore();
	});

	it('should create a new listing', async () => {
		const newListing = {
			landlordId: landlordId,
			title: 'Economical One-Bedroom Apartment',
			description: 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.',
			photos: photos,
			address: {
				streetNumber: '19',
				streetName: 'Liviu Rebreanu',
				city: 'Bucharest',
				stateOrProvince: 'Bucharest',
				postalCode: '031781',
				country: 'Romania'
			},
			location: {
				type: 'Point',
				coordinates: [26.1290, 44.4275]
			},
			type: 'Apartment',
			price: 300,
			numberOfRooms: 1,
			numberOfBathrooms: 1,
			size: 30,
			amenities: ['Furnished', 'Affordable utilities', 'Quiet neighborhood'],
		};

		listingMock.expects('create').withArgs(newListing).resolves(newListing);

		const result = await Listing.create(newListing);

		expect(result).to.have.property('title', 'Economical One-Bedroom Apartment');
		expect(result).to.have.property('description', 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.');
		listingMock.verify();
	});

	it('should find a listing by id', async () => {
		const listingId = new mongoose.Types.ObjectId();
		const foundListing = {
			landlordId: landlordId,
			title: 'Economical One-Bedroom Apartment',
			description: 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.',
			photos: photos,
			address: {
				streetNumber: '19',
				streetName: 'Liviu Rebreanu',
				city: 'Bucharest',
				stateOrProvince: 'Bucharest',
				postalCode: '031781',
				country: 'Romania'
			},
			location: {
				type: 'Point',
				coordinates: [26.1290, 44.4275]
			},
			type: 'Apartment',
			price: 300,
			numberOfRooms: 1,
			numberOfBathrooms: 1,
			size: 30,
			amenities: ['Furnished', 'Affordable utilities', 'Quiet neighborhood'],
		};

		listingMock.expects('findById').withArgs(listingId).resolves(foundListing);

		const result = await Listing.findById(listingId);

		expect(result).to.have.property('title', 'Economical One-Bedroom Apartment');
		expect(result).to.have.property('description', 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.');
		listingMock.verify();
	});

	it('should update a listing by id', async () => {
		const listingId = new mongoose.Types.ObjectId();
		const updatedData = { title: 'Updated Listing' };
		const updatedListing = {
			_id: listingId,
			...updatedData
		};

		listingMock.expects('findByIdAndUpdate').withArgs(listingId, updatedData, { new: true }).resolves(updatedListing);

		const result = await Listing.findByIdAndUpdate(listingId, updatedData, { new: true });

		expect(result).to.have.property('title', 'Updated Listing');
		listingMock.verify();
	});

	it('should delete a listing by id', async () => {
		const listingId = new mongoose.Types.ObjectId();

		listingMock.expects('findByIdAndDelete').withArgs(listingId).resolves({ _id: listingId });

		const result = await Listing.findByIdAndDelete(listingId);

		expect(result).to.have.property('_id', listingId);
		listingMock.verify();
	});
});


