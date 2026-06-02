import express from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController.js';

const newsletterRouter = express.Router();

// POST /api/newsletter/subscribe
newsletterRouter.post('/subscribe', subscribeNewsletter);

export default newsletterRouter;
