import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Logo from './Logo'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Footer = () => {
    const { navigate, axios } = useAppContext();
    const [email,    setEmail]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/api/newsletter/subscribe', { email });
            if (data.success) {
                setSubmitted(true);
                setEmail('');
                toast.success("You're subscribed! Check your inbox 🎉");
            } else {
                toast.error(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Subscription failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const socialLinks = [
        { icon: assets.instagramIcon, label: 'Instagram', url: 'https://www.instagram.com/' },
        { icon: assets.facebookIcon,  label: 'Facebook',  url: 'https://www.facebook.com/' },
        { icon: assets.twitterIcon,   label: 'Twitter',   url: 'https://www.twitter.com/' },
        { icon: assets.linkendinIcon, label: 'LinkedIn',  url: 'https://www.linkedin.com/' },
    ];

    const companyLinks = [
        { label: 'Home',        path: '/' },
        { label: 'About',       path: '/about' },
        { label: 'Hotels',      path: '/rooms' },
        { label: 'Experience',  path: '/experience' },
        { label: 'Contact Us',  path: '/about' },
    ];

    return (
        <footer className='relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white/70 pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden'>

            {/* Decorative blobs */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-[#85A4E1]/10 rounded-full blur-3xl pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-80 h-80 bg-[#85A4E1]/5 rounded-full blur-3xl pointer-events-none' />

            <div className='relative z-10'>
                {/* Top row */}
                <div className='flex flex-wrap justify-between gap-12 md:gap-8 pb-12 border-b border-white/10'>

                    {/* Brand */}
                    <div className='max-w-80'>
                        {/* Clicking logo navigates to homepage top */}
                        <button onClick={() => { navigate('/'); scrollTo(0, 0); }} className='cursor-pointer'>
                            <Logo variant='light' />
                        </button>
                        <p className='text-sm mt-5 leading-relaxed text-white/60'>
                            Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                        </p>
                        {/* Social icons */}
                        <div className='flex items-center gap-4 mt-6'>
                            {socialLinks.map(s => (
                                <a key={s.label} href={s.url} target='_blank' rel='noopener noreferrer'
                                    aria-label={s.label}
                                    className='w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200'>
                                    <img src={s.icon} alt={s.label} className='w-4'
                                        style={{ filter: 'brightness(0) invert(1)' }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <p className='text-white font-semibold text-sm uppercase tracking-widest mb-4'>Company</p>
                        <ul className='space-y-2.5 text-sm'>
                            {companyLinks.map(item => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => { navigate(item.path); scrollTo(0, 0); }}
                                        className='hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200 cursor-pointer text-left'>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <p className='text-white font-semibold text-sm uppercase tracking-widest mb-4'>Support</p>
                        <ul className='space-y-2.5 text-sm'>
                            {['Help Center', 'Safety Information', 'Cancellation Options', 'Contact Us', 'Accessibility'].map(item => (
                                <li key={item}>
                                    <a href='#' className='hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200'>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className='max-w-72'>
                        <p className='text-white font-semibold text-sm uppercase tracking-widest mb-4'>Stay Updated</p>
                        <p className='text-sm leading-relaxed text-white/60 mb-4'>
                            Subscribe for inspiration and exclusive travel offers.
                        </p>
                        {submitted ? (
                            <div className='bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center'>
                                <p className='text-sm font-semibold text-white'>🎉 You're subscribed!</p>
                                <p className='text-xs text-white/60 mt-0.5'>Check your inbox for a welcome surprise.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className='flex items-center'>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className='bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-l-xl h-11 px-4 text-sm outline-none flex-1 focus:border-[#85A4E1] focus:bg-white/10 transition-all disabled:opacity-60'
                                    placeholder='Your email'
                                />
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='flex items-center justify-center bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] h-11 w-11 rounded-r-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 shrink-0'>
                                    {loading
                                        ? <svg className='w-4 h-4 animate-spin text-white' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/></svg>
                                        : <img src={assets.arrowIcon} alt='subscribe' className='w-3.5 invert' />
                                    }
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom row */}
                <div className='flex flex-col md:flex-row gap-3 items-center justify-between pt-8 text-xs text-white/50'>
                    <p>
                        © {new Date().getFullYear()} BookEase. All rights reserved. | Built by{' '}
                        <a href='https://abhisek-personal-portfolio.vercel.app/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-white/70 hover:text-[#85A4E1] transition-colors font-medium'>
                            Abhisek Panigrahy
                        </a>
                    </p>
                    <ul className='flex items-center gap-5'>
                        {['Privacy', 'Terms', 'Sitemap'].map(item => (
                            <li key={item}>
                                <a href='#' className='hover:text-white transition-colors'>{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
