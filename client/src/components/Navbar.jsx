import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import Logo from "./Logo";

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home',       path: '/' },
        { name: 'Hotels',     path: '/rooms' },
        { name: 'Experience', path: '/experience' },
        { name: 'About',      path: '/about' },
    ];

    const [isScrolled,  setIsScrolled]  = useState(false);
    const [isMenuOpen,  setIsMenuOpen]  = useState(false);

    const { openSignIn } = useClerk();
    const location = useLocation();

    // user can be null (not logged in), undefined (Clerk still loading), or object (loaded)
    const { user, navigate, isOwner, isRoleLoaded, setShowHotelReg } = useAppContext();

    // isOwner is false until fetchUser resolves — use a stable "auth ready" flag
    // Clerk sets user to null (not logged in) or an object (logged in) — undefined means still loading
    const authReady = user !== undefined;

    useEffect(() => {
        if (location.pathname !== '/') { setIsScrolled(true); return; }
        setIsScrolled(false);
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [location.pathname]);

    // Close mobile menu on route change
    useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

    const linkCls = isScrolled ? "text-gray-700" : "text-white";
    const barCls  = isScrolled ? "bg-gray-700"   : "bg-white";

    const dashboardBtn = (
        <button
            onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}
            className={`text-sm font-semibold border-2 rounded-full px-5 py-2 transition-all duration-200 active:scale-95 cursor-pointer
                ${isScrolled
                    ? 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-gray-900'}`}>
            {isOwner ? 'Dashboard' : 'List Your Hotel'}
        </button>
    );

    return (
        <>
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50
            ${isScrolled ? "bg-white/90 shadow-md backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/' onClick={() => scrollTo(0, 0)}>
                <Logo variant={isScrolled ? 'dark' : 'light'} />
            </Link>

            {/* Desktop links — use Link/NavLink (no page reload) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/'}
                        onClick={() => scrollTo(0, 0)}
                        className={({ isActive }) =>
                            `group flex flex-col gap-0.5 text-sm font-medium transition-colors ${linkCls} ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`
                        }>
                        {link.name}
                        <span className={`${barCls} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </NavLink>
                ))}

                {/* Show dashboard button only when auth and role are fully resolved */}
                {authReady && user && isRoleLoaded && dashboardBtn}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-4">
                <img src={assets.searchIcon} alt="search"
                    className={`${isScrolled ? 'invert' : ''} h-6 cursor-pointer transition-all duration-500`}
                    onClick={() => { navigate('/rooms'); scrollTo(0, 0); }} />

                {/* Show nothing until Clerk resolves, then login or avatar */}
                {!authReady ? (
                    <div className='w-8 h-8 rounded-full bg-white/20 animate-pulse ml-2' />
                ) : user ? (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button onClick={openSignIn}
                        className="ml-2 text-sm font-bold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] px-7 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer">
                        Login
                    </button>
                )}
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
                <button onClick={() => setIsMenuOpen(true)} className="p-1" aria-label="Open menu">
                    <img src={assets.menuIcon} alt="menu" className={`${isScrolled ? 'invert' : ''} h-5`} />
                </button>
            </div>
        </nav>

        {/* Mobile drawer — rendered outside <nav> so it truly covers the full viewport */}
        <div className={`fixed inset-0 bg-white flex flex-col md:hidden items-center justify-center gap-7 font-medium transition-all duration-500 z-[999]
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <button className="absolute top-5 right-5 p-2" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                <img src={assets.closeIcon} alt="close" className="h-5" />
            </button>

            <Logo variant='dark' />

            {navLinks.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => { setIsMenuOpen(false); scrollTo(0, 0); }}
                    className={({ isActive }) =>
                        `text-base font-medium transition-colors ${isActive ? 'text-[#5b7fe8]' : 'text-gray-700 hover:text-[#85A4E1]'}`
                    }>
                    {link.name}
                </NavLink>
            ))}

            {authReady && user && isRoleLoaded && (
                <button
                    className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer"
                    onClick={() => { isOwner ? navigate('/owner') : setShowHotelReg(true); setIsMenuOpen(false); }}>
                    {isOwner ? 'Dashboard' : 'List Your Hotel'}
                </button>
            )}

            {authReady && !user && (
                <button onClick={openSignIn}
                    className="text-sm font-bold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] px-8 py-3 rounded-xl shadow-md shadow-[#85A4E1]/30 active:scale-95 transition-all duration-200 cursor-pointer">
                    Login
                </button>
            )}
        </div>
        </>
    );
};

export default Navbar;
