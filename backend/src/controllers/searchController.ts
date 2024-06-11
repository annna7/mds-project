import { Request, Response } from 'express';
import { SearchService } from '../services';

export const SearchController = {
	async search(req: Request, res: Response) {
		try {
			const results = await SearchService.search(req.body);
			res.status(200).json(results);
		} catch (error) {
			res.status(500).json({ error: 'Error during search!' });
		}
	},
};