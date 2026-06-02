import React, { useEffect, useRef, useState } from 'react'
import Title from '../components/Title'
import AnimateIn from '../components/AnimateIn'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { BookingRowSkeleton } from '../components/Skeleton'
import toast from 'react-hot-toast'
import StarRating from '../components/StarRating'

const CACHE_KEY = 'be_my_bookings';

// ── Review Modal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit({ bookingId: booking._id, rating, comment });
        setSubmitting(false);
    };

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6' onClick={onClose}>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-6' onClick={e => e.stopPropagation()}>
                <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-xl font-bold text-gray-900'>Rate Your Stay</h3>
                    <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                        <img src={assets.closeIcon} alt="close" className='h-4 w-4' />
                    </button>
                </div>

                <div className='mb-6 flex flex-col items-center gap-2'>
                    <div className='flex gap-1.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setRating(star)} className='focus:outline-none transition-transform active:scale-90'>
                                <img 
                                    src={star <= rating ? assets.starIconFilled : assets.starIconOutlined} 
                                    alt="star" 
                                    className='h-8 w-8' 
                                />
                            </button>
                        ))}
                    </div>
                    <p className='text-sm font-semibold text-[#5b7fe8]'>{rating} / 5 Stars</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5'>Your Experience</label>
                        <textarea 
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder='Tell us about your stay...'
                            className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all min-h-[120px] resize-none'
                            required
                        />
                    </div>
                    <button 
                        type='submit'
                        disabled={submitting}
                        className='w-full bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#85A4E1]/30 transition-all active:scale-95 disabled:opacity-60'
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

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
    const [reviewing, setReviewing] = useState(null);
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

    const handleReviewSubmit = async (reviewData) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/reviews/add', reviewData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                toast.success(data.message);
                setReviewing(null);
                fetchUserBookings(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!user || fetched.current) return;
        fetched.current = true;
        fetchUserBookings(!!sessionStorage.getItem(CACHE_KEY));
    }, [user]);

    return (
        <AnimateIn as='div' variant='fadeUpSoft' className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            {reviewing && (
                <ReviewModal 
                    booking={reviewing} 
                    onClose={() => setReviewing(null)} 
                    onSubmit={handleReviewSubmit} 
                />
            )}
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
                    <div>Hotels</div><div>Date &amp; Timings</div><div>Actions</div>
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
                        : bookings.map(booking => {
                            return (
                                <AnimateIn key={booking._id} as='div' variant='fadeUpSoft' once={false} 
                                    className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-100 py-6 first:border-t hover:bg-gray-50/60 transition-colors rounded-xl px-2 cursor-pointer relative group'
                                    onClick={() => { navigate(`/rooms/${booking.room._id}`); scrollTo(0, 0); }}
                                >
                                    {/* Hotel info */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <img src={booking.room.images[0]} alt="hotel"
                                            className='md:w-40 h-28 md:h-28 rounded-xl object-cover shadow-sm' />
                                        <div className='flex flex-col gap-1.5'>
                                            <p className='font-playfair text-xl font-semibold group-hover:text-[#5b7fe8] transition-colors'>{booking.hotel.name}
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

                                    {/* Actions */}
                                    <div className='flex flex-col items-start justify-center pt-3 md:pt-0 gap-3' onClick={e => e.stopPropagation()}>
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
                                        {booking.isPaid && (
                                            <button 
                                                onClick={() => setReviewing(booking)}
                                                className='text-xs font-bold text-[#5b7fe8] border border-[#5b7fe8] hover:bg-[#5b7fe8] hover:text-white px-5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer'
                                            >
                                                Rate Experience
                                            </button>
                                        )}
                                    </div>
                                </AnimateIn>
                            );
                        })
                }
            </div>
        </AnimateIn>
    );
};

export default MyBookings;
