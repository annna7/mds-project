import {expect} from 'chai';
import {SearchService} from '../../src/services';
import sinon from 'sinon';
import listings from '../database/seeds/listings';
import {ISearchParams, Listing} from '../../src/models';


const listings = [
	{
		landlordId: '663cb48ee88f928f9cb35f69',
		title: 'Economical One-Bedroom Apartment',
		description: 'Ideal for singles or couples, located in a quiet area, with easy access to metro and local markets.',
		photos: [
			'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart1.jpeg?alt=media&token=ef9567f0-aa4f-4370-a207-7afc1c22f022',
			'https://firebasestorage.googleapis.com/v0/b/one-roof-bb7ce.appspot.com/o/apart2.jpeg?alt=media&token=b08cc3a8-f2b9-4a75-a8f6-4fa4ee7467c4'
		],
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

];



describe('SearchService', () => {


	it('should return restricted listings based on geospatial query', async () => {
		const SEARCH_PARAMS: ISearchParams = {
			region: {
				longitudeDelta: 0.02194281667470932,
				latitudeDelta: 0.023822259153881475,
				longitude: 26.095423232764006,
				latitude: 44.432513710156485
			}
			,
			filters: {
				roomType: 'any',
				providerType: 'any',
				priceRange: { min: 100, max: 3000 },
				bedrooms: 0,
				bathrooms: 0,
				amenities: [],
				shouldSearch: false,
			},
		};

		const result = await SearchService.search(SEARCH_PARAMS);
		console.log(result);
		/*expect(Listing.find.calledWith(sinon.match({
			location: {
				$geoWithin: {
					$box: [
						[26.079000000000004, 44.3775],
						[26.179000000000002, 44.4775],
					],
				},
			},
		}))).to.be.true;*/

		expect(result.listings).to.have.lengthOf(1);
		expect(result.listings[0].landlordId).to.equal('663cb48ee88f928f9cb35f69');
	});
});
