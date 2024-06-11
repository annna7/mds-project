import { Request, Response } from 'express';
import { ReviewService } from '../services';

export const ReviewController = {
	async createReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.createReview(req.body);
			res.status(201).json(review);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create review' });
		}
	},

	async getReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.getReviewById(req.params.id);
			if (!review) {
				return res.status(404).json({ error: 'Review not found' });
			}
			res.json(review);
		} catch (error) {
			res.status(500).json({ error: 'Failed to retrieve review' });
		}
	},

	async updateReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.updateReviewById(req.params.id, req.body);
			if (!review) {
				return res.status(404).json({ error: 'Review not found' });
			}
			res.json(review);
		} catch (error) {
			res.status(500).json({ error: 'Failed to update review' });
		}
	},

	async deleteReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.deleteReviewById(req.params.id);
			if (!review) {
				return res.status(404).json({ error: 'Review not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ error: 'Failed to delete review' });
		}
	}
};
