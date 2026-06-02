import React from 'react';

// Base shimmer block
export const Shimmer = ({ className = '' }) => (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] rounded-lg ${className}`}
        style={{ animation: 'shimmer 1.4s infinite linear' }} />
);

// Stat card skeleton (Dashboard)
export const StatCardSkeleton = () => (
    <div className='bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm'>
        <Shimmer className='h-12 w-12 rounded-xl' />
        <div className='flex-1 space-y-2'>
            <Shimmer className='h-3 w-24' />
            <Shimmer className='h-6 w-16' />
        </div>
    </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ cols = 4 }) => (
    <tr>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className='py-3.5 px-4 border-t border-gray-100'>
                <Shimmer className='h-3.5 w-full rounded' />
            </td>
        ))}
    </tr>
);

// Hotel card skeleton (AllRooms list view)
export const RoomListSkeleton = () => (
    <div className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-200'>
        <Shimmer className='w-full md:w-1/2 h-52 rounded-xl' />
        <div className='md:w-1/2 space-y-3'>
            <Shimmer className='h-4 w-24 rounded-full' />
            <Shimmer className='h-8 w-3/4' />
            <Shimmer className='h-4 w-1/2' />
            <div className='flex gap-2 mt-4'>
                {[1,2,3].map(i => <Shimmer key={i} className='h-8 w-24 rounded-lg' />)}
            </div>
            <Shimmer className='h-5 w-20' />
        </div>
    </div>
);

// Grid card skeleton (Home featured)
export const CardSkeleton = () => (
    <div className='rounded-2xl overflow-hidden bg-white shadow-sm'>
        <Shimmer className='h-52 w-full rounded-none' />
        <div className='p-4 space-y-3'>
            <Shimmer className='h-5 w-3/4' />
            <Shimmer className='h-3.5 w-1/2' />
            <Shimmer className='h-3 w-1/3' />
            <Shimmer className='h-9 w-full rounded-xl mt-2' />
        </div>
    </div>
);

// Booking row skeleton
export const BookingRowSkeleton = () => (
    <div className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-100 py-6 gap-4'>
        <div className='flex gap-4'>
            <Shimmer className='w-40 h-28 rounded-xl shrink-0' />
            <div className='flex-1 space-y-2.5'>
                <Shimmer className='h-5 w-3/4' />
                <Shimmer className='h-3.5 w-1/2' />
                <Shimmer className='h-3.5 w-1/3' />
                <Shimmer className='h-4 w-24' />
            </div>
        </div>
        <div className='space-y-3'>
            <Shimmer className='h-3 w-16' />
            <Shimmer className='h-4 w-28' />
            <Shimmer className='h-3 w-16' />
            <Shimmer className='h-4 w-28' />
        </div>
        <div className='space-y-3'>
            <Shimmer className='h-6 w-16 rounded-full' />
            <Shimmer className='h-8 w-24 rounded-xl' />
        </div>
    </div>
);

// inject keyframes once
const style = document.createElement('style');
style.textContent = `
@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}`;
if (!document.head.querySelector('[data-shimmer]')) {
    style.setAttribute('data-shimmer', '1');
    document.head.appendChild(style);
}
