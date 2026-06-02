import React, { useEffect, useRef, useState } from 'react'
import Title from '../../components/Title'
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

// ── Main Page ──────────────────────────────────────────────────────────────────
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
        <div className='pb-10'>
            {deleteTarget && (
                <ConfirmDialog
                    message='Delete this booking?'
                    sub='This cannot be undone and the booking will be permanently removed.'
                    onConfirm={handleDeleteBooking}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <Title align='left' font='outfit' title='Dashboard'
                subTitle='Monitor your room listings, track bookings and analyze revenue — all in one place.' />

            {/* Stat cards */}
            <div className='flex flex-wrap gap-4 my-8'>
                {loading
                    ? [1, 2].map(i => <div key={i} className='w-52'><StatCardSkeleton /></div>)
                    : stats.map(s => (
                        <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl flex items-center gap-4 p-5 pr-10 shadow-sm`}>
                            <div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm'>
                                <img src={s.icon} alt={s.label} className='h-6' />
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${s.color}`}>{s.label}</p>
                                <p className='text-2xl font-bold text-gray-800 mt-0.5'>{s.value}</p>
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

            <div className='w-full max-w-4xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
                <div className='max-h-96 overflow-y-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-gray-50 sticky top-0 z-10'>
                            <tr>
                                {['User Name', 'Room', 'Total Amount', 'Payment Status', 'Action'].map((h, i) => (
                                    <th key={i}
                                        className={`py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === 'Room' ? 'max-sm:hidden' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-sm'>
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                                : dashboardData.bookings
                                    .filter(item => item.room)
                                    .map((item) => (
                                        <tr key={item._id} className='hover:bg-gray-50/70 transition-colors'>
                                            <td className='py-3.5 px-4 text-gray-700 font-medium'>{item.user.username}</td>
                                            <td className='py-3.5 px-4 text-gray-600 max-sm:hidden'>{item.room.roomType}</td>
                                            <td className='py-3.5 px-4 text-gray-700 font-semibold'>{currency} {item.totalPrice.toLocaleString()}</td>
                                            <td className='py-3.5 px-4'>
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
                                                    ${item.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    {item.isPaid ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                            {/* Delete button — always visible */}
                                            <td className='py-3.5 px-4 text-right'>
                                                <button
                                                    onClick={() => setDeleteTarget(item._id)}
                                                    title='Delete booking'
                                                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all cursor-pointer ml-auto'>
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
