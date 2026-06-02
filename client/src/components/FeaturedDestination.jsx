import React from 'react'
import HotelCard from './HotelCard'
import { useAppContext } from '../context/AppContext'
import AnimateIn, { StaggerContainer, StaggerItem } from './AnimateIn'

const FeaturedDestination = () => {
    const { rooms, navigate } = useAppContext();

    if (!rooms.length) return null;

    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-white'>
            {/* Header */}
            <AnimateIn className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>
                        ✦ Top Picks
                    </p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>
                        Featured Destinations
                    </h2>
                    <p className='text-gray-500 mt-2 max-w-md text-sm leading-relaxed'>
                        Handpicked exceptional properties offering unparalleled luxury and unforgettable experiences.
                    </p>
                </div>
                <button
                    onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                    className='shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer'>
                    View All
                    <span className='text-base leading-none'>→</span>
                </button>
            </AnimateIn>

            {/* Grid */}
            <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {rooms.slice(0, 4).map((room, index) => (
                    <StaggerItem key={room._id} variant='fadeUp'>
                        <HotelCard room={room} index={index} />
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
};

export default FeaturedDestination;
