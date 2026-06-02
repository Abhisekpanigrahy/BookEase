import React, { useEffect, useRef, useState } from 'react'
import Title from '../../components/Title';
import { useAppContext } from '../../context/AppContext';
import { TableRowSkeleton } from '../../components/Skeleton';
import toast from 'react-hot-toast';

const CACHE_KEY = 'be_owner_rooms';

// ── Confirm Dialog ────────────────────────────────────────────────────────────
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full'>
            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4'>
                <svg className='w-6 h-6 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
                </svg>
            </div>
            <p className='text-center font-semibold text-gray-800 text-base'>{message}</p>
            <p className='text-center text-sm text-gray-500 mt-1'>This action cannot be undone. All bookings for this room will also be deleted.</p>
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

// ── Edit Modal ────────────────────────────────────────────────────────────────
const AMENITY_OPTIONS = ['Free Wifi', 'Free Breakfast', 'Room Service', 'Mountain View', 'Pool Access'];
const ROOM_TYPES      = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];

const EditModal = ({ room, onClose, onSave }) => {
    const [roomType,      setRoomType]      = useState(room.roomType);
    const [pricePerNight, setPricePerNight] = useState(room.pricePerNight);
    const [amenities,     setAmenities]     = useState(room.amenities);
    const [saving,        setSaving]        = useState(false);

    const toggleAmenity = (a) =>
        setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(room._id, { roomType, pricePerNight, amenities: JSON.stringify(amenities) });
        setSaving(false);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
            <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full'>
                <div className='flex items-center justify-between mb-5'>
                    <h3 className='text-lg font-bold text-gray-800'>Edit Room</h3>
                    <button onClick={onClose} className='p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer'>
                        <svg className='w-5 h-5 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Room image preview */}
                {room.images?.[0] && (
                    <img src={room.images[0]} alt='Room' className='w-full h-36 object-cover rounded-xl mb-5' />
                )}

                {/* Room type */}
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Room Type</label>
                <select value={roomType} onChange={e => setRoomType(e.target.value)}
                    className='mt-1 mb-4 border border-gray-200 rounded-xl w-full px-3 py-2.5 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all'>
                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Price */}
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price / Night ($)</label>
                <input type='number' value={pricePerNight} onChange={e => setPricePerNight(e.target.value)}
                    className='mt-1 mb-4 border border-gray-200 rounded-xl w-full px-3 py-2.5 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all' />

                {/* Amenities */}
                <label className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Amenities</label>
                <div className='mt-2 mb-5 flex flex-wrap gap-2'>
                    {AMENITY_OPTIONS.map(a => (
                        <button key={a} type='button' onClick={() => toggleAmenity(a)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${amenities.includes(a) ? 'bg-[#5b7fe8] border-[#5b7fe8] text-white' : 'border-gray-200 text-gray-600 hover:border-[#85A4E1]'}`}>
                            {a}
                        </button>
                    ))}
                </div>

                <div className='flex gap-3'>
                    <button onClick={onClose}
                        className='flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer'>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className='flex-1 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 transition-all active:scale-95 cursor-pointer disabled:opacity-60'>
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ListRoom = () => {
    const { axios, getToken, user, currency } = useAppContext();
    const [rooms,         setRooms]         = useState(() => {
        try { const r = sessionStorage.getItem(CACHE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
    });
    const [loading,       setLoading]       = useState(!sessionStorage.getItem(CACHE_KEY));
    const [deleteTarget,  setDeleteTarget]  = useState(null); // room to delete
    const [editTarget,    setEditTarget]    = useState(null); // room to edit
    const fetched = useRef(false);

    const fetchRooms = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                setRooms(data.rooms);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.rooms));
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleToggle = async (roomId) => {
        try {
            const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                toast.success(data.message);
                setRooms(prev => prev.map(r => r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r));
                sessionStorage.removeItem(CACHE_KEY);
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/rooms/${deleteTarget}`, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                toast.success(data.message);
                setRooms(prev => prev.filter(r => r._id !== deleteTarget));
                sessionStorage.removeItem(CACHE_KEY);
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
        finally { setDeleteTarget(null); }
    };

    const handleEdit = async (id, fields) => {
        try {
            const form = new URLSearchParams(fields);
            const { data } = await axios.put(`/api/rooms/${id}`, Object.fromEntries(form), {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });
            if (data.success) {
                toast.success(data.message);
                sessionStorage.removeItem(CACHE_KEY);
                await fetchRooms(true);
                setEditTarget(null);
            } else toast.error(data.message);
        } catch (e) { toast.error(e.message); }
    };

    useEffect(() => {
        if (!user || fetched.current) return;
        fetched.current = true;
        fetchRooms(!!sessionStorage.getItem(CACHE_KEY));
    }, [user]);

    return (
        <div className='pb-10'>
            {deleteTarget && (
                <ConfirmDialog
                    message='Delete this room?'
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
            {editTarget && (
                <EditModal
                    room={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={handleEdit}
                />
            )}

            <Title align='left' font='outfit' title='Room Listings'
                subTitle='View, edit, or manage all listed rooms. Keep information up-to-date for the best user experience.' />

            <div className='flex items-center justify-between mt-8 mb-3'>
                <p className='text-sm font-semibold text-gray-600'>
                    {loading ? 'Loading…' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''}`}
                </p>
                <button onClick={() => fetchRooms(false)}
                    className='text-xs text-[#5b7fe8] hover:text-[#4a6edb] font-semibold transition-colors cursor-pointer'>
                    ↻ Refresh
                </button>
            </div>

            <div className='w-full max-w-5xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
                <div className='max-h-[600px] overflow-y-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-gray-50 sticky top-0 z-10'>
                            <tr>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16'>Image</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Room Type</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider max-sm:hidden'>Amenities</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price / Night</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center'>Available</th>
                                <th className='py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-sm'>
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                                : rooms.map((item) => (
                                    <tr key={item._id} className='hover:bg-gray-50/70 transition-colors'>
                                        {/* Room image */}
                                        <td className='py-3 px-4'>
                                            <img
                                                src={item.images?.[0]}
                                                alt={item.roomType}
                                                className='w-14 h-12 object-cover rounded-lg shadow-sm'
                                            />
                                        </td>
                                        {/* Room type */}
                                        <td className='py-3 px-4'>
                                            <span className='font-semibold text-gray-800'>{item.roomType}</span>
                                        </td>
                                        {/* Amenities */}
                                        <td className='py-3 px-4 max-sm:hidden'>
                                            <div className='flex flex-wrap gap-1'>
                                                {item.amenities.slice(0, 3).map(a => (
                                                    <span key={a} className='text-xs bg-[#85A4E1]/10 text-[#5b7fe8] px-2 py-0.5 rounded-full font-medium'>{a}</span>
                                                ))}
                                                {item.amenities.length > 3 && (
                                                    <span className='text-xs text-gray-400'>+{item.amenities.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        {/* Price */}
                                        <td className='py-3 px-4 font-bold text-gray-800'>{currency} {item.pricePerNight}</td>
                                        {/* Toggle */}
                                        <td className='py-3 px-4'>
                                            <label className='relative inline-flex items-center justify-center cursor-pointer gap-2 w-full'>
                                                <input type='checkbox' className='sr-only peer'
                                                    checked={item.isAvailable}
                                                    onChange={() => handleToggle(item._id)} />
                                                <div className='w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#5b7fe8] transition-colors duration-200 relative after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5' />
                                            </label>
                                        </td>
                                        {/* Edit / Delete actions */}
                                        <td className='py-3 px-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => setEditTarget(item)}
                                                    title='Edit room'
                                                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-[#5b7fe8] transition-colors cursor-pointer'>
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                                                    </svg>
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteTarget(item._id)}
                                                    title='Delete room'
                                                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer'>
                                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                    </svg>
                                                </button>
                                            </div>
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

export default ListRoom;
