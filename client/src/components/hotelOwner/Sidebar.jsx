import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const sideBarLinks = [
        { name: 'Dashboard', path: '/owner',           icon: assets.dashboardIcon },
        { name: 'Add Room',  path: '/owner/add-room',  icon: assets.addIcon },
        { name: 'List Room', path: '/owner/list-room', icon: assets.listIcon },
    ];

    return (
        <>
            {/* Desktop sidebar (md+) */}
            <div className='hidden md:flex md:w-64 border-r h-full text-base border-gray-300 pt-4 flex-col transition-all duration-300'>
                {sideBarLinks.map((item, index) => (
                    <NavLink to={item.path} key={index} end={item.path === '/owner'}
                        className={({ isActive }) =>
                            `flex items-center py-3 px-8 gap-3 ${isActive
                                ? 'border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600'
                                : 'hover:bg-gray-100/90 border-white text-gray-700'}`
                        }>
                        <img src={item.icon} alt={item.name} className='min-h-6 min-w-6' />
                        <p className='text-center'>{item.name}</p>
                    </NavLink>
                ))}
            </div>

            {/* Mobile bottom nav */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-lg'>
                {sideBarLinks.map((item, index) => (
                    <NavLink to={item.path} key={index} end={item.path === '/owner'}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${isActive
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'}`
                        }>
                        <img src={item.icon} alt={item.name} className='h-5 w-5' />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </>
    );
};

export default Sidebar;
