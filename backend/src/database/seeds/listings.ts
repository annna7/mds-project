import { Listing } from '../../models';

const landlordId = '663cb48ee88f928f9cb35f69';

const photos = [
	'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart1.jpeg?alt=media&token=ef9567f0-aa4f-4370-a207-7afc1c22f022',
	'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart2.jpeg?alt=media&token=b08cc3a8-f2b9-4a75-a8f6-4fa4ee7467c4'
];

const listingSeeds = [
	{
		landlordId: landlordId,
		title: 'Modern Studio in Aviației',
		description: 'Stylish studio in a new building, featuring modern amenities and a balcony with great views. Close to Herastrau Park.',
		photos: photos,
		address: '78 Aleea Teisani, Bucharest, Romania',
		location: { type: 'Point', coordinates: [26.0703, 44.4875] },
		type: 'studio',
		price: 750,
		size: 75,
		amenities: ['Balcony', 'WiFi', 'Parking'],
		external: false,
	},
	{
		landlordId: landlordId,
		title: 'Luxury Penthouse in Central Bucharest',
		description: 'Exclusive penthouse offering panoramic city views, top-notch finishes, and private elevator access. Located in the heart of the city.',
		photos: photos,
		address: '15 Calea Victoriei, Bucharest, Romania',
		location: { type: 'Point', coordinates: [26.0963, 44.4323] },
		type: 'apartment',
		price: 2000,
		numberOfRooms: 3,
		numberOfBathrooms: 3,
		size: 120,
		amenities: ['Elevator', 'Pool', 'AirConditioning', 'SecuritySystem'],
		external: false,
	},
	{
		landlordId: landlordId,
		title: 'Family Apartment Near Park and School',
		description: 'Spacious and sunny apartment in a family-friendly neighborhood, steps away from schools and large parks.',
		photos: photos,
		address: '212 Drumul Taberei, Bucharest, Romania',
		location: { type: 'Point', coordinates: [26.0454, 44.4341] },
		type: 'apartment',
		price: 500,
		numberOfRooms: 3,
		numberOfBathrooms: 2,
		size: 85,
		amenities: ['PetFriendly', 'Microwave', 'Dishwasher'],
		external: false,
	},
	{
		landlordId: landlordId,
		title: 'Economical One-Bedroom Apartment',
		description: 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.',
		photos: photos,
		address: '19 Liviu Rebreanu, Bucharest, Romania',
		location: { type: 'Point', coordinates: [26.1290, 44.4275] },
		type: 'apartment',
		price: 600,
		numberOfRooms: 1,
		numberOfBathrooms: 1,
		size: 30,
		amenities: ['Dishwasher', 'Refrigerator'],
		external: false,
	},
	{
		landlordId: landlordId,
		title: 'Spacious House in Primaverii Neighborhood',
		description: 'A large and comfortable house located in a peaceful area, perfect for a family looking for space and tranquility.',
		photos: photos,
		address: '15 Jean Monnet, Bucuresti',
		location: { type: 'Point', coordinates: [26.0525, 44.2808] },
		type: 'house',
		price: 1200,
		size: 200,
		numberOfRooms: 4,
		numberOfBathrooms: 2,
		amenities: ['Garden', 'Garage', 'Fireplace'],
		external: false,
	}
];

export const LISTINGS = listingSeeds.map((listingData) => {
	return new Listing(listingData);
});
