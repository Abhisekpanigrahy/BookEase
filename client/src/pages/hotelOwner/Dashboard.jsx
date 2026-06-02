import React, { useEffect, useRef, useState } from 'react'
import Title from '../../components/Title'
import AnimateIn from '../../components/AnimateIn'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { StatCardSkeleton, TableRowSkeleton } from '../../components/Skeleton'
import toast from 'react-hot-toast'

const CACHE_KEY = 'be_dashboard';
const CACHE_TTL = 60_000;

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
const ConfirmDialog = ({ message, sub, onConfirm, onCancel }) => (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full'>
            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4'>
                <svg className='w-6 h-6 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
            </div>
            <p className='text-center font-semibold text-gray-800 text-base'>{message}</p>
            {sub && <p className='text-center text-sm text-gray-500 mt-1'>{sub}</p>}
            <div className='flex gap-3 mt-6'>
                <button onClick={onCancel}
                    className='flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer'>
                    Cancel
                </button>
                <button onClick={onConfirm}
                    className='flex-1 bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl shadow-md shadow-red-400/30 transition-all active:scale-95 cursor-pointer'>
                    Delete
                </button>
            </div>
        </div>
    </div>
);

// ── Booking Detail Modal ──────────────────────────────────────────────────────
const BookingDetailModal = ({ booking, currency, onClose }) => {
    const fmt = (date) =>
        new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const fmtTime = (date) =>
        new Date(date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const checkIn  = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const nights   = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Small info card
    const Card = ({ icon, label, value, valueClass = '', full = false }) => (
        <div className={`bg-gray-50 rounded-xl p-3 flex flex-col gap-1 ${full ? 'col-span-2' : ''}`}>
            <span className='text-lg'>{icon}</span>
            <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none'>{label}</span>
            <span className={`text-sm font-bold text-gray-800 leading-snug break-all ${valueClass}`}>{value}</span>
        </div>
    );

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6'
            onClick={onClose}>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'
                onClick={e => e.stopPropagation()}>

                {/* ── Header: image left + title right ── */}
                <div className='flex flex-col sm:flex-row'>
                    <div className='relative sm:w-56 shrink-0'>
                        <img
                            src={booking.room.images?.[0]}
                            alt={booking.room.roomType}
                            className='w-full h-44 sm:h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none' />
                    </div>

                    <div className='flex-1 p-5 flex flex-col justify-between'>
                        <div className='flex items-start justify-between gap-3'>
                            <div>
                                <p className='text-xl font-bold text-gray-900'>{booking.room.roomType}</p>
                                <p className='text-sm text-gray-500 mt-0.5'>{booking.hotel?.name || '—'}</p>
                                <p className='font-mono text-xs text-gray-400 mt-1 break-all'># {booking._id}</p>
                            </div>
                            <button onClick={onClose}
                                className='w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer'>
                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>

                        {/* Status badges */}
                        <div className='flex flex-wrap gap-2 mt-4'>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${booking.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${booking.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {booking.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600'>
                                {booking.paymentMethod === 'Stripe' ? '💳 Stripe' : '🏨 Pay At Hotel'}
                            </span>
                        </div>

                        {/* Amount highlight */}
                        <div className='mt-4 bg-gradient-to-r from-[#5b7fe8]/10 to-[#85A4E1]/10 rounded-xl px-4 py-3 flex items-center justify-between'>
                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Total Amount</span>
                            <span className='text-2xl font-bold text-[#5b7fe8]'>{currency} {booking.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* ── Info cards grid ── */}
                <div className='p-5 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    <Card icon='👤' label='Guest Name'  value={booking.user?.username || '—'} />
                    <Card icon='📧' label='Guest Email' value={booking.user?.email || '—'} valueClass='text-xs' />
                    <Card icon='👥' label='Guests'      value={`${booking.guests} guest${booking.guests > 1 ? 's' : ''}`} />
                    <Card icon='🛏️' label='Room Type'   value={booking.room.roomType} />
                    <Card icon='📅' label='Check In'    value={fmt(booking.checkInDate)} />
                    <Card icon='📅' label='Check Out'   value={fmt(booking.checkOutDate)} />
                    <Card icon='🌙' label='Duration'    value={`${nights} night${nights !== 1 ? 's' : ''}`} />
                    <Card icon='💳' label='Payment Mode' value={booking.paymentMethod} />
                    <Card icon='🕐' label='Booked On'   value={fmtTime(booking.createdAt)} full />
                    {booking.isPaid && (
                        <Card icon='✅' label='Paid On' value={fmtTime(booking.updatedAt)} valueClass='text-emerald-600' full />
                    )}
                </div>
            </div>
        </div>
    );
};


const Dashboard = () => {
    const { currency, user, getToken, axios } = useAppContext();

    const [dashboardData, setDashboardData] = useState(() => {
        try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            if (raw) {
                const { data, ts } = JSON.parse(raw);
                if (Date.now() - ts < CACHE_TTL) return data;
            }
        } catch (_) {}
        return { bookings: [], totalBookings: 0, totalRevenue: 0 };
    });
    const [loading,       setLoading]       = useState(!sessionStorage.getItem(CACHE_KEY));
    const [deleteTarget,  setDeleteTarget]  = useState(null); // booking id to delete
    const [selectedBooking, setSelectedBooking] = useState(null); // booking for detail modal
    const fetched = useRef(false);

    const fetchDashboardData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                setDashboardData(data.dashboardData);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: data.dashboardData, ts: Date.now() }));
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleDeleteBooking = async () => {
        try {
            const { data } = await axios.delete(`/api/bookings/${deleteTarget}`, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                toast.success(data.message);
                // Optimistically remove from local state & recalculate totals
                setDashboardData(prev => {
                    const bookings     = prev.bookings.filter(b => b._id !== deleteTarget);
                    const totalBookings = bookings.length;
                    const totalRevenue  = bookings.reduce((s, b) => s + b.totalPrice, 0);
                    const next = { bookings, totalBookings, totalRevenue };
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: next, ts: Date.now() }));
                    return next;
                });
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
        finally { setDeleteTarget(null); }
    };

    useEffect(() => {
        if (!user || fetched.current) return;
        fetched.current = true;
        fetchDashboardData(!!sessionStorage.getItem(CACHE_KEY));
    }, [user]);

    const stats = [
        {
            label: 'Total Bookings',
            value: dashboardData.totalBookings,
            icon: assets.totalBookingIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Total Revenue',
            value: `${currency} ${dashboardData.totalRevenue.toLocaleString()}`,
            icon: assets.totalRevenueIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    return (
        <AnimateIn as='div' variant='fadeUpSoft' className='pb-10'>
            {deleteTarget && (
                <ConfirmDialog
                    message='Delete this booking?'
                    sub='This cannot be undone and the booking will be permanently removed.'
                    onConfirm={handleDeleteBooking}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    currency={currency}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

            <Title align='left' font='outfit' title='Dashboard'
                subTitle='Monitor your room listings, track bookings and analyze revenue — all in one place.' />

            {/* Stat cards */}
            <div className='grid grid-cols-2 md:flex md:flex-wrap gap-4 my-8'>
                {loading
                    ? [1, 2].map(i => <div key={i}><StatCardSkeleton /></div>)
                    : stats.map(s => (
                        <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl flex items-center gap-3 p-4 md:p-5 md:pr-10 shadow-sm`}>
                            <div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0'>
                                <img src={s.icon} alt={s.label} className='h-5 md:h-6' />
                            </div>
                            <div>
                                <p className={`text-xs md:text-sm font-semibold ${s.color}`}>{s.label}</p>
                                <p className='text-lg md:text-2xl font-bold text-gray-800 mt-0.5'>{s.value}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Recent bookings */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold text-gray-800'>Recent Bookings</h2>
                {!loading && (
                    <button onClick={() => fetchDashboardData(false)}
                        className='text-xs text-[#5b7fe8] hover:text-[#4a6edb] font-semibold transition-colors cursor-pointer'>
                        ↻ Refresh
                    </button>
                )}
            </div>

            <div className='w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
                {/* ── Desktop table ── */}
                <div className='hidden sm:block max-h-96 overflow-y-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-gray-50 sticky top-0 z-10'>
                            <tr>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16'>Image</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>User Name</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Room</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Check In</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Check Out</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Total Amount</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Payment Status</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-sm'>
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                                : dashboardData.bookings
                                    .filter(item => item.room)
                                    .map((item) => (
                                        <AnimateIn key={item._id} as='tr' variant='fadeUpSoft' once={false}
                                            onClick={() => setSelectedBooking(item)}
                                            className='hover:bg-blue-50/40 transition-colors cursor-pointer'>
                                            <td className='py-3 px-4'>
                                                <img
                                                    src={item.room.images?.[0]}
                                                    alt={item.room.roomType}
                                                    className='w-14 h-12 object-cover rounded-lg shadow-sm'
                                                />
                                            </td>
                                            <td className='py-3.5 px-4 text-gray-700 font-medium'>{item.user.username}</td>
                                            <td className='py-3.5 px-4 text-gray-600'>{item.room.roomType}</td>
                                            <td className='py-3.5 px-4 text-gray-600'>
                                                {new Date(item.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className='py-3.5 px-4 text-gray-600'>
                                                {new Date(item.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className='py-3.5 px-4 text-gray-700 font-semibold'>{currency} {item.totalPrice.toLocaleString()}</td>
                                            <td className='py-3.5 px-4'>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
                                                    ${item.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    {item.isPaid ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className='py-3.5 px-4 text-center' onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setDeleteTarget(item._id)}
                                                    title='Delete booking'
                                                    className='w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all cursor-pointer'>
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                    </svg>
                                                </button>
                                            </td>
                                        </AnimateIn>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile cards ── */}
                <div className='sm:hidden divide-y divide-gray-100'>
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='p-4 flex gap-3 animate-pulse'>
                                <div className='w-14 h-12 bg-gray-200 rounded-lg shrink-0' />
                                <div className='flex-1 space-y-2 py-1'>
                                    <div className='h-3 bg-gray-200 rounded w-1/2' />
                                    <div className='h-3 bg-gray-200 rounded w-1/3' />
                                </div>
                            </div>
                        ))
                        : dashboardData.bookings.filter(item => item.room).map((item) => (
                            <AnimateIn key={item._id} as='div' variant='fadeUpSoft' once={false}
                                onClick={() => setSelectedBooking(item)}
                                className='p-4 flex gap-3 items-start hover:bg-blue-50/40 transition-colors cursor-pointer'>
                                <img
                                    src={item.room.images?.[0]}
                                    alt={item.room.roomType}
                                    className='w-14 h-12 object-cover rounded-lg shadow-sm shrink-0'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='font-semibold text-gray-800 text-sm truncate'>{item.user.username}</p>
                                    <p className='text-xs text-gray-500 mt-0.5'>{item.room.roomType}</p>
                                    <p className='text-xs text-gray-400 mt-0.5'>
                                        {new Date(item.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        {' → '}
                                        {new Date(item.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                    <div className='flex items-center gap-2 mt-2'>
                                        <p className='text-sm font-bold text-gray-700'>{currency} {item.totalPrice.toLocaleString()}</p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full
                                            ${item.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {item.isPaid ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); setDeleteTarget(item._id); }}
                                    title='Delete booking'
                                    className='w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all cursor-pointer'>
                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                    </svg>
                                </button>
                            </AnimateIn>
                        ))
                    }
                </div>
            </div>
        </AnimateIn>
    );
};

export default Dashboard;
