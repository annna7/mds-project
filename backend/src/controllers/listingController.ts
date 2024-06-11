import { Request, Response } from 'express';
import { ListingService } from '../services';
import { LISTINGS } from '../database';

export const ListingController = {
	async createListing(req: Request, res: Response) {
		try {
			const listing = await ListingService.createListing(req.body);
			res.status(201).json(listing);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create listing' });
		}
	},

	async getAllListings(req: Request, res: Response) {
		const listings = await ListingService.getAllListings({});
		res.status(200).json(listings);
	},

	async getListing(req: Request, res: Response) {
		try {
			const listing = await ListingService.getListingById(req.params.id);
			if (!listing) {
				return res.status(404).json({ error: 'Listing not found' });
			}
			res.json(listing);
		} catch (error) {
			res.status(500).json({ error: 'Failed to retrieve listing' });
		}
	},

	async updateListing(req: Request, res: Response) {
		try {
			const listing = await ListingService.updateListingById(req.params.id, req.body);
			if (!listing) {
				return res.status(404).json({ error: 'Listing not found' });
			}
			res.json(listing);
		} catch (error) {
			res.status(500).json({ error: 'Failed to update listing' });
		}
	},

	async deleteListing(req: Request, res: Response) {
		try {
			const listing = await ListingService.deleteListingById(req.params.id);
			if (!listing) {
				return res.status(404).json({ error: 'Listing not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ error: 'Failed to delete listing' });
		}
	}
};
