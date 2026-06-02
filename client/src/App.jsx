import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home        from './pages/Home';
import Footer      from './components/Footer';
import AllRooms    from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings  from './pages/MyBookings';
import Experience  from './pages/Experience';
import About       from './pages/About';
import Offers      from './pages/Offers';
import HotelReg    from './components/HotelReg';
import Layout      from './pages/hotelOwner/Layout';
import Dashboard   from './pages/hotelOwner/Dashboard';
import AddRoom     from './pages/hotelOwner/AddRoom';
import ListRoom    from './pages/hotelOwner/ListRoom';
import Loader      from './components/Loader';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import AnimateIn, { PageTransition } from './components/AnimateIn';

const App = () => {
    const location = useLocation();
    const isOwnerPath = location.pathname.includes('owner');
    const { showHotelReg } = useAppContext();

    return (
        <div>
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

            {!isOwnerPath && <Navbar />}

            {showHotelReg && <HotelReg />}

            <div className='min-h-[70vh]'>
                <AnimatePresence mode='wait' initial={false}>
                    <Routes location={location} key={location.pathname}>
                        <Route path='/'           element={<PageTransition className='min-h-full'><Home /></PageTransition>} />
                        <Route path='/rooms'      element={<PageTransition className='min-h-full'><AllRooms /></PageTransition>} />
                        <Route path='/rooms/:id'  element={<PageTransition className='min-h-full'><RoomDetails /></PageTransition>} />
                        <Route path='/my-bookings' element={<PageTransition className='min-h-full'><MyBookings /></PageTransition>} />
                        <Route path='/experience' element={<PageTransition className='min-h-full'><Experience /></PageTransition>} />
                        <Route path='/about'      element={<PageTransition className='min-h-full'><About /></PageTransition>} />
                        <Route path='/offers'     element={<PageTransition className='min-h-full'><Offers /></PageTransition>} />
                        <Route path='/loader/:nextUrl' element={<PageTransition className='min-h-full'><Loader /></PageTransition>} />

                        {/* Owner dashboard */}
                        <Route path='/owner' element={<Layout />}>
                            <Route index         element={<Dashboard />} />
                            <Route path='add-room'  element={<AddRoom />} />
                            <Route path='list-room' element={<ListRoom />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </div>

            {!isOwnerPath && <Footer />}
        </div>
    );
};

export default App;
