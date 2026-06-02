import React from 'react'
import AnimateIn from '../components/AnimateIn'
import { useAppContext } from '../context/AppContext'

const features = [
    { icon: '🏨', title: 'Curated Properties', desc: 'Every hotel on BookEase is reviewed for quality, comfort, and authenticity before being listed — from city boutiques to beachfront resorts.' },
    { icon: '⚡', title: 'Instant Booking', desc: 'Real-time availability. Confirm your reservation in under a minute — no waiting, no phone calls, no back-and-forth.' },
    { icon: '💳', title: 'Secure Payments', desc: 'All payments flow through Stripe — PCI-DSS Level 1 certified. Your card details never touch our servers.' },
    { icon: '📧', title: 'Instant Confirmation', desc: 'A detailed booking confirmation reaches your inbox the moment payment clears, with everything you need for arrival.' },
    { icon: '🌍', title: '190+ Destinations', desc: 'Dubai, Singapore, New York, London — discover remarkable stays in over 190 cities worldwide and growing.' },
    { icon: '⭐', title: 'Verified Reviews', desc: 'Every rating is tied to a confirmed stay. No fake reviews, no incentivised scores — just honest guest feedback.' },
    { icon: '📊', title: 'Owner Dashboard', desc: 'Hotel owners get a dedicated dashboard to manage listings, track bookings, and monitor revenue in real time.' },
    { icon: '🔐', title: 'Clerk Authentication', desc: 'Secure sign-in powered by Clerk — supporting social logins and multi-factor authentication out of the box.' },
];

const milestones = [
    { year: '2024', event: 'BookEase concept and core architecture designed' },
    { year: '2024', event: 'Full-stack MERN platform built — rooms, bookings, payments' },
    { year: '2025', event: 'Stripe, Cloudinary, and Clerk integrations completed' },
    { year: '2025', event: 'Owner dashboard, email confirmations, and analytics shipped' },
    { year: '2026', event: 'Public launch — live on Vercel with real hotel listings' },
];

const techStack = [
    { name: 'React.js', color: 'bg-sky-100 text-sky-700' },
    { name: 'Node.js', color: 'bg-green-100 text-green-700' },
    { name: 'Express.js', color: 'bg-gray-100 text-gray-700' },
    { name: 'MongoDB', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-700' },
    { name: 'Clerk Auth', color: 'bg-purple-100 text-purple-700' },
    { name: 'Stripe', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Cloudinary', color: 'bg-blue-100 text-blue-700' },
    { name: 'Nodemailer', color: 'bg-orange-100 text-orange-700' },
    { name: 'Vercel', color: 'bg-black/5 text-gray-700' },
];

const About = () => {
    const { navigate } = useAppContext();

    return (
        <div>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-36 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(91,127,232,0.18),transparent_65%)] pointer-events-none' />
                <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-4'>✦ About BookEase</p>
                    <h1 className='font-playfair text-4xl md:text-6xl font-bold leading-tight'>
                        Your smarter way to<br />
                        <span className='text-[#85A4E1]'>book a hotel.</span>
                    </h1>
                    <p className='mt-6 text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto'>
                        BookEase is a full-stack hotel booking platform that brings together real-time availability, secure payments, and a seamless experience — for both travelers and hotel owners.
                    </p>
                    <div className='flex flex-wrap items-center justify-center gap-4 mt-8'>
                        <button onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                            className='inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#85A4E1]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                            Browse Hotels →
                        </button>
                        <button onClick={() => { navigate('/experience'); scrollTo(0, 0); }}
                            className='inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer'>
                            How It Works
                        </button>
                    </div>
                </div>
            </AnimateIn>

            {/* ── Stats ────────────────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-white px-6 md:px-16 lg:px-24 py-14'>
                <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                    {[['10K+','Hotels Listed'],['190+','Cities'],['50K+','Happy Travelers'],['4.9★','Average Rating']].map(([val, label]) => (
                        <div key={label} className='flex flex-col items-center'>
                            <p className='text-3xl md:text-4xl font-bold text-[#5b7fe8]'>{val}</p>
                            <p className='text-sm text-gray-500 mt-1 font-medium'>{label}</p>
                        </div>
                    ))}
                </div>
            </AnimateIn>

            {/* ── What is BookEase ─────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-slate-50 px-6 md:px-16 lg:px-24 py-20'>
                <div className='max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-center'>
                    <div className='lg:w-1/2'>
                        <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-3'>✦ What We Do</p>
                        <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900 leading-snug'>
                            Hotel booking, <br />done right.
                        </h2>
                        <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
                            BookEase connects travelers with exceptional hotels around the world. Search by city, filter by room type or price, check real-time availability, and pay securely — all in one place.
                        </p>
                        <p className='text-gray-500 mt-3 text-sm leading-relaxed'>
                            For hotel owners, BookEase provides a full management suite: add rooms, upload photos via Cloudinary, set pricing, manage listings, and monitor bookings from a clean owner dashboard.
                        </p>
                        <div className='flex flex-wrap gap-3 mt-6'>
                            {['For Travelers', 'For Hotel Owners', 'Fully Open Source'].map(tag => (
                                <span key={tag} className='text-xs font-semibold text-[#5b7fe8] bg-[#85A4E1]/10 px-3 py-1.5 rounded-full'>
                                    ✓ {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='lg:w-1/2 relative'>
                        <div className='absolute -inset-4 bg-gradient-to-br from-[#85A4E1]/20 to-transparent rounded-3xl blur-2xl' />
                        <img
                            src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop'
                            alt='Hotel lobby'
                            className='relative z-10 rounded-2xl shadow-xl w-full object-cover h-72 md:h-80'
                        />
                    </div>
                </div>
            </AnimateIn>

            {/* ── Features ─────────────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-white px-6 md:px-16 lg:px-24 py-20'>
                <div className='text-center mb-14'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>✦ Platform Features</p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>Everything built in</h2>
                    <p className='text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed'>
                        BookEase ships with a complete feature set — no third-party booking widgets, no compromises.
                    </p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto'>
                    {features.map((f, i) => (
                        <div key={i} className='bg-slate-50 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-gray-100'>
                            <div className='text-3xl mb-3'>{f.icon}</div>
                            <h3 className='font-bold text-gray-800 text-sm mb-1.5'>{f.title}</h3>
                            <p className='text-xs text-gray-500 leading-relaxed'>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </AnimateIn>

            {/* ── Journey / Timeline ───────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-slate-50 px-6 md:px-16 lg:px-24 py-20'>
                <div className='text-center mb-14'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>✦ Our Journey</p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>How BookEase grew</h2>
                </div>
                <div className='max-w-2xl mx-auto space-y-4'>
                    {milestones.map((m, i) => (
                        <div key={i} className='flex gap-5 items-start bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
                            <div className='shrink-0 w-14 h-14 rounded-xl bg-[#5b7fe8] flex items-center justify-center shadow-md'>
                                <span className='text-white text-xs font-bold text-center leading-tight'>{m.year}</span>
                            </div>
                            <p className='text-gray-700 text-sm leading-relaxed font-medium self-center'>{m.event}</p>
                        </div>
                    ))}
                </div>
            </AnimateIn>

            {/* ── Tech Stack ───────────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='bg-white px-6 md:px-16 lg:px-24 py-16'>
                <div className='text-center mb-10'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>✦ Built With</p>
                    <h2 className='font-playfair text-2xl md:text-3xl font-bold text-gray-900'>Technology Stack</h2>
                    <p className='text-gray-500 mt-2 text-sm'>Production-grade tools used across the full stack</p>
                </div>
                <div className='flex flex-wrap justify-center gap-3 max-w-3xl mx-auto'>
                    {techStack.map(t => (
                        <span key={t.name} className={`${t.color} text-sm font-semibold px-5 py-2 rounded-full border border-transparent shadow-sm`}>
                            {t.name}
                        </span>
                    ))}
                </div>
            </AnimateIn>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <AnimateIn as='section' variant='fadeUpSoft' className='relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6 md:px-16 lg:px-24 py-20 overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,127,232,0.12),transparent_70%)] pointer-events-none' />
                <div className='relative z-10 text-center text-white max-w-2xl mx-auto'>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold'>Ready to explore?</h2>
                    <p className='text-white/65 mt-3 text-sm leading-relaxed'>
                        Thousands of hotels are waiting. Search, compare, and book the perfect stay in seconds.
                    </p>
                    <div className='flex flex-wrap items-center justify-center gap-4 mt-8'>
                        <button onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                            className='inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-[#85A4E1]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer text-base'>
                            Browse Hotels →
                        </button>
                        <button onClick={() => { navigate('/experience'); scrollTo(0, 0); }}
                            className='inline-flex items-center gap-2 border-2 border-white/25 text-white/80 hover:text-white hover:border-white/50 font-semibold px-8 py-4 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer'>
                            Learn More
                        </button>
                    </div>
                </div>
            </AnimateIn>
        </div>
    );
};

export default About;
