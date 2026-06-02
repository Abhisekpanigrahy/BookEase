import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Creating API controller function 
export const registerHotel = async (req, res) => {
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id

        // Checking if User Already Registered
        const hotel = await Hotel.findOne({owner})
        if(hotel){
            return res.json({success: false, message: "Hotel Already Registered"})
        }

        await Hotel.create({name, address, contact, city, owner});

        // Updating role
        await User.findByIdAndUpdate(owner, {role: "hotelOwner"});

        res.json({success: true, message: "Hotel Registered Successfully"})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// API to get hotel data for a specific owner
export const getHotelData = async (req, res) => {
    try {
        const owner = req.auth.userId;
        const hotel = await Hotel.findOne({ owner });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found" });
        }
        res.json({ success: true, hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to update hotel data
export const updateHotelData = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.auth.userId;

        const hotel = await Hotel.findOneAndUpdate(
            { owner },
            { name, address, contact, city },
            { new: true }
        );

        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found" });
        }

        res.json({ success: true, message: "Hotel information updated successfully", hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};