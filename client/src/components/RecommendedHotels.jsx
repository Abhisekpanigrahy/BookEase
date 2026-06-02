import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
    const { rooms, searchedCities, navigate } = useAppContext();
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        if (rooms.length && searchedCities.length) {
            const filtered = rooms.filter(room => searchedCities.includes(room.hotel.city));
            setRecommended(filtered);
        }
    }, [rooms, searchedCities]);

    if (!recommended.length) return null;

    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-slate-50'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>
                        ✦ Based on Your Searches
                    </p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>
                        Recommended for You
                    </h2>
                    <p className='text-gray-500 mt-2 max-w-md text-sm leading-relaxed'>
                        Hotels in cities you've recently explored, curated just for you.
                    </p>
                </div>
                <button
                    onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                    className='shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#85A4E1] to-[#6b8fd4] hover:from-[#6b8fd4] hover:to-[#5a7ec3] px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/25 hover:shadow-lg hover:shadow-[#85A4E1]/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer'>
                    Explore All
                    <span className='text-base leading-none'>→</span>
                </button>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        </section>
    );
};

export default RecommendedHotels;
