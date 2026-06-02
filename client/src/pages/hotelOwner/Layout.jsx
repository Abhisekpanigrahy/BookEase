import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { PageTransition } from '../../components/AnimateIn'

const Layout = () => {
    const location = useLocation();
    const { isOwner, navigate } = useAppContext();

    useEffect(() => {
        if (!isOwner) {
            navigate('/');
        }
    }, [isOwner]);

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar />
                {/* pb-20 on mobile reserves space above the bottom nav bar */}
                <div className='flex-1 overflow-y-auto p-4 pt-8 md:px-10 pb-24 md:pb-10'>
                    <AnimatePresence mode='wait' initial={false}>
                        <PageTransition key={location.pathname} className='min-h-full'>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Layout;
