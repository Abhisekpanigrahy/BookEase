import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addReview, getHotelReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post('/add',        protect, addReview);
reviewRouter.get('/hotel/:hotelId',       getHotelReviews);

export default reviewRouter;
