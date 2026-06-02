import React, { useState } from 'react'
import AnimateIn from './AnimateIn'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");
    const [checkIn,     setCheckIn]     = useState("");
    const [checkOut,    setCheckOut]    = useState("");
    const [guests,      setGuests]      = useState(1);

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`);
        scrollTo(0, 0);
        try {
            await axios.post('/api/user/store-recent-search',
                { recentSearchedCity: destination },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );
            setSearchedCities(prev => {
                const updated = [...prev, destination];
                if (updated.length > 3) updated.shift();
                return updated;
            });
        } catch (_) { }
    };

    return (
        <AnimateIn as='section' variant='fadeUpSoft' className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden'>
            <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=85&auto=format&fit=crop")] bg-no-repeat bg-cover bg-center' />
            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70' />

            <div className='relative z-10 flex flex-col items-center text-center px-4 md:px-8 mt-16'>
                <span className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase'>
                    ✦ Premium Hotel Booking
                </span>

                <h1 className='font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl'>
                    Find Your Perfect
                    <span className='block text-[#85A4E1]'>Place to Stay</span>
                </h1>

                <p className='mt-4 text-white/75 text-base md:text-lg max-w-xl leading-relaxed'>
                    Explore thousands of handpicked hotels worldwide. Book instantly, travel confidently.
                </p>

                <div className='flex items-center gap-8 mt-8 text-white/80 text-sm'>
                    {[['10K+','Hotels'],['190+','Cities'],['4.9★','Rating']].map(([val,label]) => (
                        <div key={label} className='flex flex-col items-center'>
                            <span className='text-white font-bold text-lg'>{val}</span>
                            <span className='text-xs text-white/60'>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Search card */}
                <form onSubmit={onSearch} className='mt-10 w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1'>
                                <img src={assets.locationIcon} alt="" className='h-3.5' />Destination
                            </label>
                            <input onChange={e => setDestination(e.target.value)} value={destination} list='destinations' type="text"
                                className='border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all placeholder:text-gray-400'
                                placeholder='Where to?' required />
                            <datalist id='destinations'>{cities.map((city, i) => <option value={city} key={i} />)}</datalist>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1'>
                                <img src={assets.calenderIcon} alt="" className='h-3.5' />Check In
                            </label>
                            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                                className='border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1'>
                                <img src={assets.calenderIcon} alt="" className='h-3.5' />Check Out
                            </label>
                            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                                className='border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1'>
                                <img src={assets.guestsIcon} alt="" className='h-3.5' />Guests
                            </label>
                            <div className='flex gap-2'>
                                <input min={1} max={10} type="number" value={guests} onChange={e => setGuests(e.target.value)}
                                    className='flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all' />
                                
                                {/* Desktop search button - hidden on mobile */}
                                <button type='submit'
                                    className='hidden lg:flex flex-1 items-center justify-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white rounded-xl py-2.5 px-4 text-sm font-bold shadow-lg shadow-[#85A4E1]/35 hover:shadow-xl hover:shadow-[#85A4E1]/50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 cursor-pointer'>
                                    <img src={assets.searchIcon} alt="" className='h-4 invert' />
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Mobile search button - full width at bottom */}
                        <button type='submit'
                            className='lg:hidden flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white rounded-xl py-3 px-4 text-sm font-bold shadow-lg shadow-[#85A4E1]/35 hover:shadow-xl hover:shadow-[#85A4E1]/50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 cursor-pointer mt-2'>
                            <img src={assets.searchIcon} alt="" className='h-4 invert' />
                            Search Hotels
                        </button>
                    </div>
                </form>

                {/* Popular city pills */}
                <div className='flex flex-wrap items-center justify-center gap-2 mt-6'>
                    <span className='text-white/50 text-xs'>Popular:</span>
                    {cities.map(city => (
                        <button key={city} type='button'
                            onClick={() => { setDestination(city); navigate(`/rooms?destination=${city}`); scrollTo(0,0); }}
                            className='text-xs text-white font-medium bg-white/10 border border-white/25 hover:bg-white hover:text-gray-900 hover:border-white px-4 py-1.5 rounded-full backdrop-blur-sm transition-all duration-200 active:scale-95 cursor-pointer'>
                            {city}
                        </button>
                    ))}
                </div>
            </div>

        </AnimateIn>
    );
}

export default Hero;
