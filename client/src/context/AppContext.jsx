import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Shared in-flight request deduplicator — prevents double-fetching on StrictMode
const inflight = {};
const dedupe = (key, fn) => {
    if (!inflight[key]) inflight[key] = fn().finally(() => { delete inflight[key]; });
    return inflight[key];
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency  = import.meta.env.VITE_CURRENCY || "$";
    const navigate  = useNavigate();
    const { user, isLoaded: userLoaded }  = useUser();   // isLoaded = Clerk has resolved
    const { getToken } = useAuth();

    const [isOwner,       setIsOwner]       = useState(false);
    const [showHotelReg,  setShowHotelReg]  = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms,         setRooms]         = useState([]);

    // ─── Rooms: serve from sessionStorage cache immediately, revalidate silently ───
    const fetchRooms = () => dedupe('rooms', async () => {
        try {
            const cached = sessionStorage.getItem('be_rooms');
            if (cached) {
                setRooms(JSON.parse(cached));          // instant render from cache
            }
            // always revalidate in background (stale-while-revalidate)
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
                sessionStorage.setItem('be_rooms', JSON.stringify(data.rooms));
            }
        } catch (_) { /* silent — rooms cached, no toast needed */ }
    });

    // ─── User profile: get token and user data in parallel ───────────────────────
    const fetchUser = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 8000,
            });
            if (data.success) {
                setIsOwner(data.role === 'hotelOwner');
                setSearchedCities(data.recentSearchedCities || []);
            }
        } catch (_) { /* silent — not critical for page render */ }
    };

    // Fire rooms fetch immediately on mount (no auth needed)
    useEffect(() => { fetchRooms(); }, []);

    // Fire user fetch as soon as Clerk user is ready
    useEffect(() => { if (user) fetchUser(); }, [user]);

    const value = {
        currency, navigate, axios, toast,
        // expose undefined while Clerk is still loading so consumers can show a skeleton
        user: userLoaded ? user : undefined,
        getToken,
        isOwner,  setIsOwner,
        showHotelReg, setShowHotelReg,
        searchedCities, setSearchedCities,
        rooms,    setRooms,
        fetchRooms,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
