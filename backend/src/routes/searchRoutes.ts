import express from 'express';
import { SearchController } from '../controllers';

const searchRouter = express.Router();

searchRouter.post('/', SearchController.search);

export { searchRouter };