import express from "express";
import { cancelBooking, checkAvailabilityAPI, createBooking, deleteBooking, getHotelBookings, getUserBookings, stripePayment } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book',               protect, createBooking);
bookingRouter.get('/user',                protect, getUserBookings);
bookingRouter.get('/hotel',               protect, getHotelBookings);
bookingRouter.post('/stripe-payment',     protect, stripePayment);
bookingRouter.post('/cancel',             protect, cancelBooking);
bookingRouter.delete('/:id',              protect, deleteBooking);

export default bookingRouter;