import Hotel from "../models/Hotel.js"
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

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
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: { path: 'owner', select: 'image' }
        }).sort({createdAt: -1})
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// API to get all rooms for a specific hotel owner
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
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
        // Verify ownership
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) return res.json({ success: false, message: "No Hotel found" });

        const room = await Room.findOne({ _id: id, hotel: hotel._id });
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

        // Verify ownership
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) return res.json({ success: false, message: "No Hotel found" });

        const room = await Room.findOne({ _id: id, hotel: hotel._id });
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