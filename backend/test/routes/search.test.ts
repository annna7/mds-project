import { assert } from 'chai'; // or any assertion library you prefer
import sinon from 'sinon';
import {ISearchParams} from '../../src/models';
import {SearchService} from '../../src/services';
import {LISTINGS} from '../../src/database';


// Mock data for testing
const mockSearchParams: ISearchParams = {
	region: {
		longitudeDelta: 0.08473265916109085,
		latitudeDelta: 0.0919914678717646,
		longitude: 26.09629997983575,
		latitude: 44.43228183129124
	},
	filters: {
		roomType: 'any',
		providerType: 'any',
		priceRange: { min: 100,  max: 3000},
		bedrooms: 0,
		bathrooms: 0,
		amenities: [],
		shouldSearch: false,
	},
};

describe('SearchService', function () {
	describe('search', function () {
		let findStub;

		beforeEach(function () {
			// Stubbing Listing and Review find methods
			findStub = sinon.stub();
			sinon.stub(SearchService, 'search').callsFake(async (searchParams) => {
				return {
					listings: await findStub(searchParams),
					reviews: [],
					filteredListings: [],
					filteredReviews: []
				};
			});
		});

		afterEach(function () {
			sinon.restore(); // Restore sinon stubs after each test
		});

		it('should return correct listings and reviews', async function () {
			// Mock the return values for Listing.find and Review.find
			findStub.withArgs(sinon.match.any).resolves([LISTINGS[1]]);
			const result = await SearchService.search(mockSearchParams);
			console.log(result.listings);
			assert.equal(result.listings.length, 1, 'Expected one listing');
		});
	});
});
