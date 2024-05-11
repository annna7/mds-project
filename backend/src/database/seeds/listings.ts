import { Listing } from '../../models';

const landlordId = '663cb48ee88f928f9cb35f69';

const listingSeeds = [
	{
		landlordId: landlordId,
		title: 'Modern 2 Bedroom Apartment in Aviației',
		description: 'Stylish apartment in a new building, featuring modern amenities and a balcony with great views. Close to Herastrau Park.',
		photos: ['aviatiei1.jpg', 'aviatiei2.jpg'],
		address: {
			streetNumber: '78',
			streetName: 'Aleea Teisani',
			city: 'Bucharest',
			stateOrProvince: 'Bucharest',
			postalCode: '014031',
			country: 'Romania'
		},
		location: {
			type: 'Point',
			coordinates: [26.0703, 44.4875]
		},
		type: 'Apartment',
		price: 750,
		numberOfRooms: 2,
		numberOfBathrooms: 2,
		size: 75,
		amenities: ['Balcony', 'Modern finishes', 'Parking spot included'],
	},
	{
		landlordId: landlordId,
		title: 'Luxury Penthouse in Central Bucharest',
		description: 'Exclusive penthouse offering panoramic city views, top-notch finishes, and private elevator access. Located in the heart of the city.',
		photos: ['penthouse_central1.jpg', 'penthouse_central2.jpg'],
		address: {
			streetNumber: '15',
			streetName: 'Calea Victoriei',
			city: 'Bucharest',
			stateOrProvince: 'Bucharest',
			postalCode: '030022',
			country: 'Romania'
		},
		location: {
			type: 'Point',
			coordinates: [26.0963, 44.4323]
		},
		type: 'Apartment',
		price: 2000,
		numberOfRooms: 3,
		numberOfBathrooms: 3,
		size: 120,
		amenities: ['Private elevator', 'Swimming pool', '24/7 Security'],
	},
	{
		landlordId: landlordId,
		title: 'Family Apartment Near Park and School',
		description: 'Spacious and sunny apartment in a family-friendly neighborhood, steps away from schools and large parks.',
		photos: ['family_apartment1.jpg', 'family_apartment2.jpg'],
		address: {
			streetNumber: '212',
			streetName: 'Drumul Taberei',
			city: 'Bucharest',
			stateOrProvince: 'Bucharest',
			postalCode: '061426',
			country: 'Romania'
		},
		location: {
			type: 'Point',
			coordinates: [26.0454, 44.4341]
		},
		type: 'Apartment',
		price: 500,
		numberOfRooms: 3,
		numberOfBathrooms: 2,
		size: 85,
		amenities: ['Near park', 'Schools in vicinity', 'Recently renovated'],
	},
	{
		landlordId: landlordId,
		title: 'Economical One-Bedroom Apartment',
		description: 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.',
		photos: ['economical1.jpg', 'economical2.jpg'],
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
	}
];

export const LISTINGS = listingSeeds.map((listingData) => {
	return new Listing(listingData);
});