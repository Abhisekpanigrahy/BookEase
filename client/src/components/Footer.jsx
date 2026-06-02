import React from 'react'
import { assets } from '../assets/assets'
import Logo from './Logo'

const Footer = () => {
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
                        <Logo variant='light' />
                        <p className='text-sm mt-5 leading-relaxed text-white/60'>
                            Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and private islands.
                        </p>
                        {/* Social icons */}
                        <div className='flex items-center gap-4 mt-6'>
                            {[
                                { icon: assets.instagramIcon, label: 'Instagram' },
                                { icon: assets.facebookIcon,  label: 'Facebook' },
                                { icon: assets.twitterIcon,   label: 'Twitter' },
                                { icon: assets.linkendinIcon, label: 'LinkedIn' }
                            ].map(s => (
                                <a key={s.label} href="#" aria-label={s.label}
                                    className='w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200'>
                                    <img src={s.icon} alt={s.label} className='w-4 invert opacity-70' />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <p className='text-white font-semibold text-sm uppercase tracking-widest mb-4'>Company</p>
                        <ul className='space-y-2.5 text-sm'>
                            {['About', 'Careers', 'Press', 'Blog', 'Partners'].map(item => (
                                <li key={item}>
                                    <a href="#" className='hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200'>{item}</a>
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
                                    <a href="#" className='hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200'>{item}</a>
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
                        <div className='flex items-center'>
                            <input
                                type="email"
                                className='bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-l-xl h-11 px-4 text-sm outline-none flex-1 focus:border-[#85A4E1] focus:bg-white/10 transition-all'
                                placeholder='Your email'
                            />
                            <button className='flex items-center justify-center bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] h-11 w-11 rounded-r-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                                <img src={assets.arrowIcon} alt="subscribe" className='w-3.5 invert' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className='flex flex-col md:flex-row gap-3 items-center justify-between pt-8 text-xs text-white/50'>
                    <p>
                        © {new Date().getFullYear()} BookEase. All rights reserved. | Built by{' '}
                        <a href="https://abhisek-personal-portfolio.vercel.app/" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-white/70 hover:text-[#85A4E1] transition-colors font-medium">
                            Abhisek Panigrahy
                        </a>
                    </p>
                    <ul className='flex items-center gap-5'>
                        {['Privacy', 'Terms', 'Sitemap'].map(item => (
                            <li key={item}>
                                <a href="#" className='hover:text-white transition-colors'>{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
