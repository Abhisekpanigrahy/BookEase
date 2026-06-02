import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffer from '../components/ExclusiveOffer'
import Testimonial from '../components/Testimonial'
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'
import FAQ from '../components/FAQ'
import { useAppContext } from '../context/AppContext'

// Skeleton card shown while rooms are loading
const SkeletonCard = () => (
    <div className='rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse'>
        <div className='h-52 bg-gray-200' />
        <div className='p-4 space-y-3'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-1/2' />
            <div className='h-3 bg-gray-200 rounded w-1/3' />
            <div className='h-8 bg-gray-100 rounded-xl mt-4' />
        </div>
    </div>
);

const FeaturedSkeleton = () => (
    <section className='px-6 md:px-16 lg:px-24 py-20 bg-white'>
        <div className='mb-12 space-y-3'>
            <div className='h-3 bg-gray-200 rounded w-24 animate-pulse' />
            <div className='h-8 bg-gray-200 rounded w-56 animate-pulse' />
            <div className='h-4 bg-gray-100 rounded w-80 animate-pulse' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    </section>
);

const Home = () => {
    const { rooms, isRoomsLoaded } = useAppContext();

    return (
        <>
            <Hero />
            <RecommendedHotels />
            {!isRoomsLoaded ? (
                <FeaturedSkeleton />
            ) : rooms.length > 0 ? (
                <FeaturedDestination />
            ) : null}
            <ExclusiveOffer />
            <Testimonial />
            <NewsLetter />
            <FAQ />
        </>
    );
};

export default Home;
