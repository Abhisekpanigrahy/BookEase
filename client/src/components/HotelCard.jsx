import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const HotelCard = ({ room, index }) => {
    const { currency } = useAppContext();
    return (
        <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)}
            className='group flex flex-col rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>

            <div className='relative overflow-hidden h-52'>
                <img src={room.images[0]} alt={room.hotel.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' loading='lazy' />
                {index % 2 === 0 && (
                    <span className='absolute top-3 left-3 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm'>
                        Best Seller
                    </span>
                )}
                <div className='absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-xl px-3 py-1.5 shadow-sm'>
                    <span className='text-gray-900 font-bold text-base'>{currency}{room.pricePerNight}</span>
                    <span className='text-gray-400 text-xs'>/night</span>
                </div>
            </div>

            <div className='flex flex-col flex-1 p-4'>
                <div className='flex items-start justify-between gap-2'>
                    <p className='font-playfair text-lg font-semibold text-gray-800 leading-tight line-clamp-1'>{room.hotel.name}</p>
                    <div className='flex items-center gap-0.5 shrink-0 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg'>
                        <img src={assets.starIconFilled} alt="star" className='h-3.5 w-3.5' />
                        <span className='text-xs font-bold text-amber-600'>{room.avgRating}</span>
                    </div>
                </div>

                <div className='flex items-center gap-1 mt-1.5 text-gray-400'>
                    <img src={assets.locationIcon} alt="location" className='h-3.5 shrink-0' />
                    <span className='text-xs truncate'>{room.hotel.address}</span>
                </div>

                <span className='mt-2 text-xs text-[#5b7fe8] font-semibold bg-[#85A4E1]/10 self-start px-2.5 py-0.5 rounded-full'>
                    {room.roomType}
                </span>

                {room.amenities?.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-3'>
                        {room.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>{a}</span>
                        ))}
                    </div>
                )}

                {/* Book Now — always visible solid gradient button */}
                <div className='mt-auto pt-3 mt-3'>
                    <span className='block w-full text-center text-sm font-bold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] group-hover:from-[#4a6edb] group-hover:to-[#6b8fd4] rounded-xl py-2.5 shadow-sm group-hover:shadow-md group-hover:shadow-[#85A4E1]/30 transition-all duration-200'>
                        Book Now →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default HotelCard;
