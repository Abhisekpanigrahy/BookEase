import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import AnimateIn from '../components/AnimateIn';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms, getToken, axios, navigate } = useAppContext();
    const [room, setRoom]             = useState(null);
    const [mainImage, setMainImage]   = useState(null);
    const [checkInDate, setCheckInDate]   = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests]         = useState(1);
    const [isAvailable, setIsAvailable]   = useState(false);
    const [loading, setLoading]       = useState(false);

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
        if (r) { setRoom(r); setMainImage(r.images[0]); }
    }, [rooms]);

    return room && (
        <AnimateIn as='div' variant='fadeUpSoft' className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}
                    <span className='font-inter text-sm ml-2'>({room.roomType})</span></h1>
                <span className='text-xs font-bold py-1.5 px-3 text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-sm'>20% OFF</span>
            </div>

            <div className='flex items-center gap-1 mt-2'>
                <StarRating /><p className='ml-2 text-sm text-gray-500'>200+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="" /><span>{room.hotel.address}</span>
            </div>

            {/* Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2'>
                    <img src={mainImage} alt="Room" className='w-full rounded-2xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2'>
                    {room.images.length > 1 && room.images.map((img, i) => (
                        <img key={i} src={img} alt="Room" onClick={() => setMainImage(img)}
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer transition-all duration-200 hover:opacity-90 ${mainImage === img ? 'ring-2 ring-[#85A4E1] ring-offset-2' : ''}`} />
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
                        <label htmlFor="checkInDate" className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'>Check-In</label>
                        <div className="relative">
                            <input 
                                onFocus={(e) => { e.target.type = "date"; setTimeout(() => e.target.showPicker?.(), 10); }}
                                onClick={(e) => { e.target.type = "date"; setTimeout(() => e.target.showPicker?.(), 10); }}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                onChange={e => setCheckInDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]} 
                                type="text" 
                                id='checkInDate'
                                placeholder="dd-mm-yyyy"
                                className='w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all cursor-pointer min-h-[46px]' required />
                            <img src={assets.calenderIcon} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                        </div>
                    </div>
                    <div className='w-px h-12 bg-gray-200 max-md:hidden' />
                    <div className='flex flex-col w-full md:w-auto'>
                        <label htmlFor="checkOutDate" className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5'>Check-Out</label>
                        <div className="relative">
                            <input 
                                onFocus={(e) => { e.target.type = "date"; setTimeout(() => e.target.showPicker?.(), 10); }}
                                onClick={(e) => { e.target.type = "date"; setTimeout(() => e.target.showPicker?.(), 10); }}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                onChange={e => setCheckOutDate(e.target.value)} 
                                min={checkInDate || new Date().toISOString().split('T')[0]} 
                                disabled={!checkInDate} 
                                type="text" 
                                id='checkOutDate'
                                placeholder="dd-mm-yyyy"
                                className='w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all disabled:opacity-50 cursor-pointer min-h-[46px]' required />
                            <img src={assets.calenderIcon} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
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

            {/* Common specs */}
            <div className='mt-20 space-y-5'>
                {roomCommonData.map((spec, i) => (
                    <div key={i} className='flex items-start gap-3'>
                        <img src={spec.icon} alt={spec.title} className='w-6 mt-0.5' />
                        <div>
                            <p className='font-semibold text-gray-800'>{spec.title}</p>
                            <p className='text-sm text-gray-500 mt-0.5'>{spec.description}</p>
                        </div>
                    </div>
                ))}
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
                        <div className='flex items-center mt-1'><StarRating /><p className='ml-2 text-sm text-gray-500'>200+ reviews</p></div>
                    </div>
                </div>
                <button className='mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                    Contact Now
                </button>
            </div>
        </AnimateIn>
    );
};

export default RoomDetails;
