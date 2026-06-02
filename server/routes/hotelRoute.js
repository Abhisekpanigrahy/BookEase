import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHotelData, registerHotel, updateHotelData } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

// Endpoints
hotelRouter.post('/',        protect, registerHotel);
hotelRouter.get('/get-data', protect, getHotelData);
hotelRouter.put('/update',   protect, updateHotelData);

export default hotelRouter;