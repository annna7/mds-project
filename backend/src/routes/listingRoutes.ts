import express from 'express';
import { ListingController } from '../controllers';

const listingRouter = express.Router();

listingRouter.post('/', ListingController.createListing);
listingRouter.get('/', ListingController.getAllListings);
listingRouter.get('/:id', ListingController.getListing);
listingRouter.put('/:id', ListingController.updateListing);
listingRouter.delete('/:id', ListingController.deleteListing);

export { listingRouter };