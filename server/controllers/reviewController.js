import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

// API to add a review for a stay
export const addReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const user = req.user._id;

        // Verify booking exists and belongs to user
        const booking = await Booking.findOne({ _id: bookingId, user });
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Policy: Can only review after check-out date
        if (new Date() < new Date(booking.checkOutDate)) {
            return res.json({ success: false, message: "You can only submit a review after your stay is complete" });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.json({ success: false, message: "You have already reviewed this stay" });
        }

        await Review.create({
            user,
            hotel: booking.hotel,
            room: booking.room,
            booking: bookingId,
            rating,
            comment
        });

        res.json({ success: true, message: "Review submitted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get reviews for a specific hotel
export const getHotelReviews = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const reviews = await Review.find({ hotel: hotelId }).populate("user", "username image").sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
