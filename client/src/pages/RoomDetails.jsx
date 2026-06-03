import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import AnimateIn from '../components/AnimateIn';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Calendar SVG icon (black)
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// ── Review Item Component ─────────────────────────────────────────────────────
const ReviewItem = ({ review }) => (
    <div className='py-6 border-b border-gray-100 last:border-0'>
        <div className='flex items-center gap-3 mb-3'>
            <img src={review.user.image} alt={review.user.username} className='w-10 h-10 rounded-full object-cover ring-2 ring-gray-50' />
            <div>
                <p className='text-sm font-bold text-gray-900'>{review.user.username}</p>
                <div className='flex items-center gap-2'>
                    <div className='flex gap-0.5'>
                        {[...Array(5)].map((_, i) => (
                            <img 
                                key={i} 
                                src={i < review.rating ? assets.starIconFilled : assets.starIconOutlined} 
                                alt="star" 
                                className='h-2.5 w-2.5' 
                            />
                        ))}
                    </div>
                    <span className='text-[10px] text-gray-400 font-medium'>{new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </div>
        <p className='text-sm text-gray-600 leading-relaxed pl-13'>{review.comment}</p>
    </div>
);

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms, getToken, axios, navigate } = useAppContext();
    const [room, setRoom]             = useState(null);
    const [mainImage, setMainImage]   = useState(null);
    const [checkInDate, setCheckInDate]   = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests]         = useState(1);
    const [isAvailable, setIsAvailable]   = useState(false);
    const [loading, setLoading]       = useState(false);
    const [reviews, setReviews]       = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const checkInRef  = useRef(null);
    const checkOutRef = useRef(null);

    const today = new Date().toISOString().split('T')[0];

    const formatDisplay = (val) => {
        if (!val) return 'dd-mm-yyyy';
        const [y, m, d] = val.split('-');
        return `${d}-${m}-${y}`;
    };

    const fetchReviews = async (hotelId) => {
        try {
            const { data } = await axios.get(`/api/reviews/hotel/${hotelId}`);
            if (data.success) setReviews(data.reviews);
        } catch (_) { }
        finally { setReviewsLoading(false); }
    };

    const checkAvailability = async () => {
        try {
            if (checkInDate >= checkOutDate) { toast.error('Check-In must be before Check-Out'); return; }
            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate });
            if (data.success) {
                setIsAvailable(data.isAvailable);
                data.isAvailable ? toast.success('Room is available') : toast.error('Room is not available');
            } else { toast.error(data.message); }
        } catch (error) { toast.error(error.message); }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!isAvailable) { checkAvailability(); return; }
        setLoading(true);
        try {
            const { data } = await axios.post('/api/bookings/book',
                { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );
            if (data.success) { toast.success(data.message); navigate('/my-bookings'); scrollTo(0, 0); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const r = rooms.find(r => r._id === id);
        if (r) { 
            setRoom(r); 
            setMainImage(r.images[0]); 
            fetchReviews(r.hotel._id);
        }
    }, [rooms, id]);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return room && (
        <AnimateIn as='div' variant='fadeUpSoft' className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}
                    <span className='font-inter text-sm ml-2'>({room.roomType})</span></h1>
                <span className='text-xs font-bold py-1.5 px-3 text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-sm'>20% OFF</span>
            </div>

            <div className='flex items-center gap-1 mt-2'>
                <div className='flex gap-0.5 mr-1'>
                    {[...Array(5)].map((_, i) => (
                        <img key={i} src={i < Math.round(averageRating) ? assets.starIconFilled : assets.starIconOutlined} alt="star" className='h-3.5 w-3.5' />
                    ))}
                </div>
                <p className='text-sm font-bold text-gray-700'>{averageRating}</p>
                <p className='ml-2 text-sm text-gray-500'>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="" /><span>{room.hotel.address}</span>
            </div>

            {/* Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2'>
                    <img src={mainImage} alt="Room" className='w-full rounded-2xl shadow-lg object-cover aspect-[4/3]' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2'>
                    {room.images.length > 1 && room.images.map((img, i) => (
                        <img key={i} src={img} alt="Room" onClick={() => setMainImage(img)}
                            className={`w-full rounded-xl shadow-md object-cover aspect-[4/3] cursor-pointer transition-all duration-200 hover:opacity-90 ${mainImage === img ? 'ring-2 ring-[#85A4E1] ring-offset-2' : ''}`} />
                    ))}
                </div>
            </div>

            {/* Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div>
                    <h2 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h2>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-3'>
                        {room.amenities.map((item, i) => (
                            <div key={i} className='flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5F5FF] border border-[#85A4E1]/20'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs font-medium text-gray-700'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='text-2xl font-bold text-gray-800'>${room.pricePerNight}<span className='text-base font-normal text-gray-500'>/night</span></p>
            </div>

            {/* Booking form */}
            <form onSubmit={onSubmitHandler}
                className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_24px_rgba(0,0,0,0.1)] p-6 rounded-2xl mx-auto mt-16 max-w-6xl gap-6'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-8 text-gray-600'>
                    <div className='flex flex-col w-full md:w-auto'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'>Check-In</label>
                        <div
                            onClick={() => { checkInRef.current?.showPicker?.(); checkInRef.current?.focus(); }}
                            className='relative border border-gray-200 rounded-xl min-h-[46px] flex items-center justify-between px-3 gap-3 cursor-pointer hover:border-[#85A4E1] transition-all bg-white select-none w-full md:w-44'
                        >
                            <span className={`text-sm ${checkInDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {formatDisplay(checkInDate)}
                            </span>
                            <CalendarIcon />
                            <input
                                ref={checkInRef}
                                type="date"
                                id='checkInDate'
                                onChange={e => setCheckInDate(e.target.value)}
                                min={today}
                                required
                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
                                tabIndex={-1}
                            />
                        </div>
                    </div>
                    <div className='w-px h-12 bg-gray-200 max-md:hidden' />
                    <div className='flex flex-col w-full md:w-auto'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'>Check-Out</label>
                        <div
                            onClick={() => { if (checkInDate) { checkOutRef.current?.showPicker?.(); checkOutRef.current?.focus(); } }}
                            className={`relative border border-gray-200 rounded-xl min-h-[46px] flex items-center justify-between px-3 gap-3 transition-all bg-white select-none w-full md:w-44 ${checkInDate ? 'cursor-pointer hover:border-[#85A4E1]' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            <span className={`text-sm ${checkOutDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {formatDisplay(checkOutDate)}
                            </span>
                            <CalendarIcon />
                            <input
                                ref={checkOutRef}
                                type="date"
                                id='checkOutDate'
                                onChange={e => setCheckOutDate(e.target.value)}
                                min={checkInDate || today}
                                disabled={!checkInDate}
                                required
                                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:opacity-0'
                                tabIndex={-1}
                            />
                        </div>
                    </div>
                    <div className='w-px h-12 bg-gray-200 max-md:hidden' />
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'>Guests</label>
                        <input onChange={e => setGuests(e.target.value)} value={guests} type="number" id='guests'
                            className='w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all' required />
                    </div>
                </div>

                {/* Check / Book button */}
                <button type='submit' disabled={loading}
                    className={`max-md:w-full px-10 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                        ${isAvailable
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 shadow-emerald-400/35 hover:shadow-emerald-400/50'
                            : 'bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] shadow-[#85A4E1]/35 hover:shadow-[#85A4E1]/50'}`}>
                    {loading ? 'Processing…' : isAvailable ? '✓ Book Now' : 'Check Availability'}
                </button>
            </form>

            <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mt-20'>
                {/* Reviews Section */}
                <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8'>
                    <div className='flex items-center justify-between mb-8 pb-4 border-b border-gray-50'>
                        <h3 className='text-2xl font-bold text-gray-900'>Guest Reviews</h3>
                        <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl'>
                            <span className='text-lg font-bold text-[#5b7fe8]'>{averageRating}</span>
                            <div className='flex gap-0.5'>
                                {[...Array(5)].map((_, i) => (
                                    <img key={i} src={i < Math.round(averageRating) ? assets.starIconFilled : assets.starIconOutlined} alt="star" className='h-3 w-3' />
                                ))}
                            </div>
                        </div>
                    </div>

                    {reviewsLoading ? (
                        <div className='space-y-6 animate-pulse'>
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className='h-32 bg-gray-50 rounded-2xl w-full' />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className='py-12 text-center'>
                            <div className='text-4xl mb-4 opacity-30'>💬</div>
                            <p className='text-gray-500 text-sm'>No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className='divide-y divide-gray-50'>
                            {reviews.map(review => (
                                <ReviewItem key={review._id} review={review} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Common specs */}
                <div className='space-y-6'>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>Property Policies</h3>
                    {roomCommonData.map((spec, i) => (
                        <div key={i} className='flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors'>
                            <div className='bg-[#85A4E1]/10 p-2.5 rounded-lg shrink-0'>
                                <img src={spec.icon} alt={spec.title} className='w-5 h-5' />
                            </div>
                            <div>
                                <p className='font-bold text-gray-800 text-sm'>{spec.title}</p>
                                <p className='text-xs text-gray-500 mt-1 leading-relaxed'>{spec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='max-w-3xl border-y border-gray-200 my-12 py-10 text-gray-500 text-sm leading-relaxed'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable two-bedroom apartment with a true city feeling. The price quoted is for two guests — at the guests slot please mark the number of guests to get the exact price for groups.</p>
            </div>

            {/* Hosted by */}
            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4 items-center'>
                    {room.hotel.owner && (
                        <img src={room.hotel.owner.image} alt="Host" className='h-14 w-14 md:h-16 md:w-16 rounded-full ring-2 ring-[#85A4E1]/30' />
                    )}
                    <div>
                        <p className='text-lg md:text-xl font-semibold text-gray-800'>Hosted by {room.hotel.name}</p>
                        <div className='flex items-center mt-1'>
                            <div className='flex gap-0.5 mr-2'>
                                {[...Array(5)].map((_, i) => (
                                    <img key={i} src={i < Math.round(averageRating) ? assets.starIconFilled : assets.starIconOutlined} alt="star" className='h-3 w-3' />
                                ))}
                            </div>
                            <p className='text-sm text-gray-500'>{reviews.length} reviews</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => { if (room.hotel.owner?.email) window.location.href = `mailto:${room.hotel.owner.email}?subject=Inquiry regarding ${room.hotel.name}`; }}
                    className='mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                    Contact Now
                </button>
            </div>
        </AnimateIn>
    );
};

export default RoomDetails;
