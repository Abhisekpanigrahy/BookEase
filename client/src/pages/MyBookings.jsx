import React, { useEffect, useRef, useState } from 'react'
import Title from '../components/Title'
import AnimateIn from '../components/AnimateIn'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { BookingRowSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'

const CACHE_KEY = 'be_my_bookings';

const MyBookings = () => {
    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState(() => {
        try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (_) { return []; }
    });
    const [loading,  setLoading]  = useState(!sessionStorage.getItem(CACHE_KEY));
    const [paying,   setPaying]   = useState(null);
    const fetched = useRef(false);

    const fetchUserBookings = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/bookings/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setBookings(data.bookings);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.bookings));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (bookingId) => {
        setPaying(bookingId);
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) window.location.href = data.url;
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setPaying(null);
        }
    };

    useEffect(() => {
        if (!user || fetched.current) return;
        fetched.current = true;
        fetchUserBookings(!!sessionStorage.getItem(CACHE_KEY));
    }, [user]);

    return (
        <AnimateIn as='div' variant='fadeUpSoft' className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex items-start justify-between'>
                <Title title='My Bookings'
                    subTitle='Manage your past, current and upcoming hotel reservations in one place.' align='left' />
                <button onClick={() => fetchUserBookings(false)}
                    className='mt-2 text-xs text-[#5b7fe8] hover:text-[#4a6edb] font-semibold transition-colors cursor-pointer shrink-0'>
                    ↻ Refresh
                </button>
            </div>

            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                {/* Header row */}
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase tracking-wider py-3'>
                    <div>Hotels</div><div>Date &amp; Timings</div><div>Payment</div>
                </div>

                {loading
                    ? Array.from({ length: 3 }).map((_, i) => <BookingRowSkeleton key={i} />)
                    : bookings.length === 0
                        ? (
                            <div className='flex flex-col items-center justify-center py-24 text-gray-400'>
                                <img src={assets.calenderIcon} alt="" className='h-12 opacity-30 mb-4' />
                                <p className='text-lg font-semibold'>No bookings yet</p>
                                <p className='text-sm mt-1'>Your reservations will appear here</p>
                            </div>
                        )
                        : bookings.map(booking => (
                            <AnimateIn key={booking._id} as='div' variant='fadeUpSoft' once={false} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-100 py-6 first:border-t hover:bg-gray-50/60 transition-colors rounded-xl px-2'>

                                {/* Hotel info */}
                                <div className='flex flex-col md:flex-row gap-4'>
                                    <img src={booking.room.images[0]} alt="hotel"
                                        className='md:w-40 h-28 md:h-28 rounded-xl object-cover shadow-sm' />
                                    <div className='flex flex-col gap-1.5'>
                                        <p className='font-playfair text-xl font-semibold'>{booking.hotel.name}
                                            <span className='font-inter text-xs font-normal text-gray-400 ml-1.5'>({booking.room.roomType})</span>
                                        </p>
                                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                                            <img src={assets.locationIcon} alt="" className='h-3.5' />
                                            <span>{booking.hotel.address}</span>
                                        </div>
                                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                                            <img src={assets.guestsIcon} alt="" className='h-3.5' />
                                            <span>Guests: {booking.guests}</span>
                                        </div>
                                        <p className='text-sm font-bold text-gray-800 mt-1'>
                                            Total: ${booking.totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className='flex flex-row md:flex-col md:justify-center gap-6 md:gap-3 mt-3 md:mt-0'>
                                    <div>
                                        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Check-In</p>
                                        <p className='text-sm text-gray-700 font-medium mt-0.5'>{new Date(booking.checkInDate).toDateString()}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Check-Out</p>
                                        <p className='text-sm text-gray-700 font-medium mt-0.5'>{new Date(booking.checkOutDate).toDateString()}</p>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className='flex flex-col items-start justify-center pt-3 md:pt-0 gap-3'>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${booking.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${booking.isPaid ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        {booking.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                    {!booking.isPaid && (
                                        <button onClick={() => handlePayment(booking._id)}
                                            disabled={paying === booking._id}
                                            className='text-xs font-bold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] px-5 py-2.5 rounded-xl shadow-sm shadow-[#85A4E1]/30 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60'>
                                            {paying === booking._id ? 'Redirecting…' : 'Pay Now →'}
                                        </button>
                                    )}
                                </div>
                            </AnimateIn>
                        ))
                }
            </div>
        </AnimateIn>
    );
};

export default MyBookings;
