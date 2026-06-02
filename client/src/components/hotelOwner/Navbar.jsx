import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import Logo from '../Logo'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white shadow-sm'>
            <Link to='/'>
                <Logo variant='dark' />
            </Link>
            <UserButton />
        </div>
    );
};

export default Navbar;
