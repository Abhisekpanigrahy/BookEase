import Hotel from "../models/Hotel.js"
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})
        if(!hotel) return res.json({success: false, message: "No Hotel found"});
        const uploadImages = req.files.map(async (file) => {
           const response = await cloudinary.uploader.upload(file.path);
           return response.secure_url;
        })
        const images = await Promise.all(uploadImages)
        await Room.create({
            hotel: hotel._id,
            owner: req.auth.userId,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({ success: true, message: "Room Created Successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API to get all rooms
export const getRooms = async (req, res) => {
    try {
        // Fetch all available rooms
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: { path: 'owner', select: 'image email' }
        }).sort({createdAt: -1});

        // Get unique hotel IDs from the rooms
        const hotelIds = [...new Set(rooms.map(room => room.hotel._id))];

        // Fetch all reviews for these hotels in one go
        const reviews = await Review.find({ hotel: { $in: hotelIds } });

        // Calculate average rating and total reviews for each hotel
        const reviewStats = reviews.reduce((acc, review) => {
            const hotelId = review.hotel.toString();
            if (!acc[hotelId]) {
                acc[hotelId] = { totalRating: 0, count: 0 };
            }
            acc[hotelId].totalRating += review.rating;
            acc[hotelId].count += 1;
            return acc;
        }, {});

        // Map stats back to rooms
        const roomsWithReviews = rooms.map(room => {
            const hotelId = room.hotel._id.toString();
            const stats = reviewStats[hotelId];
            const avgRating = stats 
                ? (stats.totalRating / stats.count).toFixed(1)
                : "0.0";
            
            const roomObj = room.toObject();
            roomObj.avgRating = avgRating;
            roomObj.totalReviews = stats ? stats.count : 0;
            return roomObj;
        });

        res.json({success: true, rooms: roomsWithReviews});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// API to get all rooms for a specific hotel owner
export const getOwnerRooms = async (req, res) => {
    try {
        const rooms = await Room.find({owner: req.auth.userId}).populate("hotel");
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// API to toggle availability of a room
export const toggleRoomAvailabililty = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message: "Room availability Updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// API to delete a room — DELETE /api/rooms/:id
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findOne({ _id: id, owner: req.auth.userId });
        if (!room) return res.json({ success: false, message: "Room not found or not yours" });

        // Delete all bookings for this room first
        await Booking.deleteMany({ room: id });

        await Room.findByIdAndDelete(id);
        res.json({ success: true, message: "Room deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to update a room — PUT /api/rooms/:id
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, pricePerNight, amenities } = req.body;

        const room = await Room.findOne({ _id: id, owner: req.auth.userId });
        if (!room) return res.json({ success: false, message: "Room not found or not yours" });

        if (roomType)      room.roomType = roomType;
        if (pricePerNight) room.pricePerNight = +pricePerNight;
        if (amenities)     room.amenities = JSON.parse(amenities);

        await room.save();
        res.json({ success: true, message: "Room updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};