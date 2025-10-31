import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createExpence, getExpences, updateExpence, deleteExpence } from '../controllers/expenceController.js';

const expenceRouter = express.Router();

expenceRouter.post('/' , protect,  createExpence);
expenceRouter.get('/' , protect,  getExpences);

expenceRouter.put('/:id',protect, updateExpence);
expenceRouter.delete('/:id',protect, deleteExpence);

export default expenceRouter;










