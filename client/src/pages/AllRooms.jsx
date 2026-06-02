import React, { useMemo, useState } from 'react'
import { assets, facilityIcons } from '../assets/assets'
import { useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import AnimateIn from '../components/AnimateIn'
import { useAppContext } from '../context/AppContext'
import { RoomListSkeleton } from '../components/Skeleton'

// ── Filter checkbox ───────────────────────────────────────────────────────────
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
    <label className='flex items-center gap-2.5 cursor-pointer py-1.5 group'>
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'bg-[#5b7fe8] border-[#5b7fe8]' : 'border-gray-300 group-hover:border-[#85A4E1]'}`}>
            {selected && (
                <svg className='w-2.5 h-2.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
            )}
        </span>
        <input type='checkbox' checked={selected} onChange={e => onChange(e.target.checked, label)} className='sr-only' />
        <span className='text-sm text-gray-600 select-none group-hover:text-gray-800 transition-colors'>{label}</span>
    </label>
);

// ── Sort radio ────────────────────────────────────────────────────────────────
const RadioBtn = ({ label, selected = false, onChange = () => {} }) => (
    <label className='flex items-center gap-2.5 cursor-pointer py-1.5 group'>
        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? 'border-[#5b7fe8]' : 'border-gray-300 group-hover:border-[#85A4E1]'}`}>
            {selected && <span className='w-2 h-2 rounded-full bg-[#5b7fe8]' />}
        </span>
        <input type='radio' name='sortOption' checked={selected} onChange={() => onChange(label)} className='sr-only' />
        <span className='text-sm text-gray-600 select-none group-hover:text-gray-800 transition-colors'>{label}</span>
    </label>
);

// ── Room card (horizontal) ────────────────────────────────────────────────────
const RoomCard = ({ room, navigate, currency }) => (
    <AnimateIn as='div' variant='fadeUpSoft' once={false} className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-0.5 flex flex-col md:flex-row'>
        {/* Image */}
        <div className='relative overflow-hidden md:w-72 lg:w-80 shrink-0 h-56 md:h-auto cursor-pointer'
            onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}>
            <img
                src={room.images[0]}
                alt={room.hotel.name}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                loading='lazy'
            />
            {/* Price badge */}
            <div className='absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-xl px-3 py-1.5 shadow-md'>
                <span className='font-bold text-gray-900 text-base'>{currency}{room.pricePerNight}</span>
                <span className='text-gray-400 text-xs'>/night</span>
            </div>
            {/* City badge */}
            <div className='absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm'>
                {room.hotel.city}
            </div>
        </div>

        {/* Info */}
        <div className='flex flex-col flex-1 p-5 md:p-6 justify-between'>
            <div>
                {/* Name + rating */}
                <div className='flex items-start justify-between gap-3'>
                    <h3
                        className='font-playfair text-xl md:text-2xl font-semibold text-gray-900 leading-snug cursor-pointer hover:text-[#5b7fe8] transition-colors'
                        onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}>
                        {room.hotel.name}
                    </h3>
                    <div className='flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl'>
                        <img src={assets.starIconFilled} alt='star' className='h-3.5 w-3.5' />
                        <span className='text-xs font-bold text-amber-600'>{room.avgRating}</span>
                        <span className='text-xs text-amber-400'>· {room.totalReviews}</span>
                    </div>
                </div>

                {/* Room type badge */}
                <span className='inline-block mt-2 text-xs font-semibold text-[#5b7fe8] bg-[#85A4E1]/10 px-2.5 py-1 rounded-full'>
                    {room.roomType}
                </span>

                {/* Location */}
                <div className='flex items-center gap-1.5 mt-3 text-gray-400'>
                    <img src={assets.locationIcon} alt='location' className='h-4 shrink-0' />
                    <span className='text-sm'>{room.hotel.address}</span>
                </div>

                {/* Amenities */}
                <div className='flex flex-wrap gap-2 mt-4'>
                    {room.amenities.map((item) => (
                        <div key={item} className='flex items-center gap-1.5 bg-slate-50 border border-gray-100 px-3 py-1.5 rounded-lg'>
                            <img src={facilityIcons[item]} alt={item} className='w-4 h-4' />
                            <span className='text-xs text-gray-600 font-medium'>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-between mt-5 pt-4 border-t border-gray-100'>
                <div>
                    <span className='text-2xl font-bold text-gray-900'>{currency}{room.pricePerNight}</span>
                    <span className='text-gray-400 text-sm'> / night</span>
                </div>
                <button
                    onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }}
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/25 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                    Book Now →
                </button>
            </div>
        </div>
        </AnimateIn>
    );

// ── Main Page ─────────────────────────────────────────────────────────────────
const AllRooms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { rooms, isRoomsLoaded, navigate, currency } = useAppContext();

    const [openFilters,    setOpenFilters]    = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({ roomType: [], priceRange: [] });
    const [selectedSort,   setSelectedSort]   = useState('');

    const roomTypes   = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
    const priceRanges = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
    const sortOptions = ['Price Low to High', 'Price High to Low', 'Newest First'];

    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters(prev => ({
            ...prev,
            [type]: checked
                ? [...prev[type], value]
                : prev[type].filter(v => v !== value),
        }));
    };

    const activeFilterCount =
        selectedFilters.roomType.length +
        selectedFilters.priceRange.length +
        (selectedSort ? 1 : 0) +
        (searchParams.get('destination') ? 1 : 0);

    const filteredRooms = useMemo(() => {
        const dest = searchParams.get('destination');
        return rooms
            .filter(r => {
                const matchType  = !selectedFilters.roomType.length || selectedFilters.roomType.includes(r.roomType);
                const matchPrice = !selectedFilters.priceRange.length || selectedFilters.priceRange.some(range => {
                    const [min, max] = range.split(' to ').map(Number);
                    return r.pricePerNight >= min && r.pricePerNight <= max;
                });
                const matchDest  = !dest || r.hotel.city.toLowerCase().includes(dest.toLowerCase());
                return matchType && matchPrice && matchDest;
            })
            .sort((a, b) => {
                if (selectedSort === 'Price Low to High')  return a.pricePerNight - b.pricePerNight;
                if (selectedSort === 'Price High to Low')  return b.pricePerNight - a.pricePerNight;
                if (selectedSort === 'Newest First')       return new Date(b.createdAt) - new Date(a.createdAt);
                return 0;
            });
    }, [rooms, selectedFilters, selectedSort, searchParams]);

    const clearFilters = () => {
        setSelectedFilters({ roomType: [], priceRange: [] });
        setSelectedSort('');
        setSearchParams({});
    };

    const destination = searchParams.get('destination');

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* ── Page header ── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-28 pb-12 px-6 md:px-16 lg:px-24 xl:px-32'>
                <div className='max-w-2xl'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-3'>✦ Browse Hotels</p>
                    <h1 className='font-playfair text-3xl md:text-5xl font-bold text-white leading-tight'>
                        {destination
                            ? <>Hotels in <span className='text-[#85A4E1]'>{destination}</span></>
                            : 'Find Your Perfect Stay'}
                    </h1>
                    <p className='text-white/60 mt-3 text-sm leading-relaxed max-w-xl'>
                        {filteredRooms.length > 0 || rooms.length > 0
                            ? `${filteredRooms.length} propert${filteredRooms.length === 1 ? 'y' : 'ies'} available`
                            : 'Loading available rooms…'}
                    </p>
                </div>
            </AnimateIn>

            <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-8 flex flex-col lg:flex-row gap-8 items-start'>

                {/* ── Filter sidebar ── */}
                <AnimateIn as='aside' variant='fadeUpSoft' className='w-full lg:w-72 shrink-0'>
                    {/* Mobile toggle */}
                    <button
                        onClick={() => setOpenFilters(v => !v)}
                        className='lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-3 cursor-pointer'>
                        <span className='font-semibold text-gray-800 text-sm flex items-center gap-2'>
                            <svg className='w-4 h-4 text-[#5b7fe8]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z' />
                            </svg>
                            Filters
                            {activeFilterCount > 0 && (
                                <span className='bg-[#5b7fe8] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                                    {activeFilterCount}
                                </span>
                            )}
                        </span>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${openFilters ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                    </button>

                    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${openFilters ? 'block' : 'hidden lg:block'}`}>
                        {/* Header */}
                        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
                            <span className='font-bold text-gray-800 flex items-center gap-2'>
                                <svg className='w-4 h-4 text-[#5b7fe8]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z' />
                                </svg>
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className='bg-[#5b7fe8] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                                        {activeFilterCount}
                                    </span>
                                )}
                            </span>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters}
                                    className='text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer'>
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Destination tag */}
                        {destination && (
                            <div className='px-5 py-3 border-b border-gray-100'>
                                <div className='flex items-center gap-2 bg-[#85A4E1]/10 rounded-xl px-3 py-2'>
                                    <img src={assets.locationIcon} alt='' className='h-4' />
                                    <span className='text-sm text-[#5b7fe8] font-semibold flex-1 truncate'>{destination}</span>
                                    <button onClick={() => setSearchParams({})} className='text-gray-400 hover:text-gray-600 cursor-pointer'>×</button>
                                </div>
                            </div>
                        )}

                        {/* Room type */}
                        <div className='px-5 py-4 border-b border-gray-100'>
                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Room Type</p>
                            {roomTypes.map(r => (
                                <CheckBox key={r} label={r}
                                    selected={selectedFilters.roomType.includes(r)}
                                    onChange={(checked) => handleFilterChange(checked, r, 'roomType')} />
                            ))}
                        </div>

                        {/* Price range */}
                        <div className='px-5 py-4 border-b border-gray-100'>
                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Price Range</p>
                            {priceRanges.map(range => (
                                <CheckBox key={range} label={`${currency} ${range}`}
                                    selected={selectedFilters.priceRange.includes(range)}
                                    onChange={(checked) => handleFilterChange(checked, range, 'priceRange')} />
                            ))}
                        </div>

                        {/* Sort */}
                        <div className='px-5 py-4'>
                            <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>Sort By</p>
                            {sortOptions.map(opt => (
                                <RadioBtn key={opt} label={opt}
                                    selected={selectedSort === opt}
                                    onChange={() => setSelectedSort(opt)} />
                            ))}
                        </div>
                    </div>
                </AnimateIn>

                {/* ── Results â”€â”€ */}
                <AnimateIn as='div' variant='fadeUpSoft' className='flex-1 min-w-0'>
                    {/* Active filter pills */}
                    {(selectedFilters.roomType.length > 0 || selectedFilters.priceRange.length > 0 || selectedSort) && (
                        <div className='flex flex-wrap gap-2 mb-5'>
                            {[...selectedFilters.roomType, ...selectedFilters.priceRange].map(f => (
                                <span key={f} className='inline-flex items-center gap-1.5 bg-[#85A4E1]/10 text-[#5b7fe8] text-xs font-semibold px-3 py-1.5 rounded-full'>
                                    {f}
                                    <button onClick={() => {
                                        const type = selectedFilters.roomType.includes(f) ? 'roomType' : 'priceRange';
                                        handleFilterChange(false, f, type);
                                    }} className='hover:text-[#4a6edb] cursor-pointer leading-none'>×</button>
                                </span>
                            ))}
                            {selectedSort && (
                                <span className='inline-flex items-center gap-1.5 bg-[#85A4E1]/10 text-[#5b7fe8] text-xs font-semibold px-3 py-1.5 rounded-full'>
                                    {selectedSort}
                                    <button onClick={() => setSelectedSort('')} className='hover:text-[#4a6edb] cursor-pointer leading-none'>×</button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Room list */}
                    <div className='flex flex-col gap-5'>
                        {!isRoomsLoaded
                            ? Array.from({ length: 4 }).map((_, i) => <RoomListSkeleton key={i} />)
                            : rooms.length === 0
                                ? (
                                    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center'>
                                        <div className='text-6xl mb-6 bg-slate-50 w-24 h-24 flex items-center justify-center rounded-full mx-auto'>🏨</div>
                                        <p className='text-2xl font-bold text-gray-900'>No hotels available yet</p>
                                        <p className='text-sm text-gray-500 mt-2 max-w-xs mx-auto'>We're currently expanding our listings. Please check back soon for new amazing places to stay!</p>
                                    </div>
                                )
                                : filteredRooms.length === 0
                                    ? (
                                        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center'>
                                            <div className='text-5xl mb-4'>🔍</div>
                                            <p className='text-lg font-bold text-gray-800'>No rooms match your filters</p>
                                            <p className='text-sm text-gray-500 mt-2 max-w-xs'>Try adjusting your filters or clearing them to see all available rooms.</p>
                                            <button onClick={clearFilters}
                                                className='mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all'>
                                                Clear Filters
                                            </button>
                                        </div>
                                    )
                                    : filteredRooms.map(room => (
                                        <RoomCard key={room._id} room={room} navigate={navigate} currency={currency} />
                                    ))
                        }
                    </div>
                </AnimateIn>
            </div>
        </div>
    );
};

export default AllRooms;
