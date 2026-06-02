import React from 'react'
import { useAppContext } from '../context/AppContext'

const experiences = [
    {
        icon: '🏨',
        title: 'Handpicked Properties',
        desc: 'Every hotel on BookEase is personally vetted for quality, comfort, and authenticity — from boutique city stays to beachfront villas.',
    },
    {
        icon: '⚡',
        title: 'Instant Booking',
        desc: 'No waiting, no back-and-forth. Browse availability in real time and confirm your reservation in under a minute.',
    },
    {
        icon: '💳',
        title: 'Secure Payments',
        desc: 'All transactions are processed through Stripe — PCI-DSS Level 1 certified. Pay once, relax completely.',
    },
    {
        icon: '📧',
        title: 'Instant Confirmation',
        desc: 'A detailed booking confirmation lands in your inbox the moment you pay, with everything you need for your trip.',
    },
    {
        icon: '🌍',
        title: 'Global Destinations',
        desc: 'From Dubai and Singapore to New York and London — discover exceptional stays in 190+ cities worldwide.',
    },
    {
        icon: '⭐',
        title: 'Verified Reviews',
        desc: 'Real ratings from real guests. Every review on BookEase is tied to a confirmed stay so you can book with confidence.',
    },
];

const steps = [
    { num: '01', title: 'Search', desc: 'Enter your destination, dates, and number of guests.' },
    { num: '02', title: 'Discover', desc: 'Browse handpicked hotels with photos, amenities, and verified reviews.' },
    { num: '03', title: 'Book', desc: 'Select your room and complete secure checkout in seconds.' },
    { num: '04', title: 'Enjoy', desc: 'Arrive, relax, and make memories. We handle everything else.' },
];

const Experience = () => {
    const { navigate } = useAppContext();

    return (
        <div className='pt-20'>
            {/* Hero */}
            <section className='relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-28 px-6 md:px-16 lg:px-24 text-white overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(91,127,232,0.15),transparent_70%)] pointer-events-none' />
                <div className='relative z-10 max-w-3xl'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-4'>✦ The BookEase Experience</p>
                    <h1 className='font-playfair text-4xl md:text-6xl font-bold leading-tight'>
                        Travel made<br /><span className='text-[#85A4E1]'>effortless.</span>
                    </h1>
                    <p className='mt-6 text-white/70 text-lg leading-relaxed max-w-xl'>
                        We believe every journey deserves a perfect place to rest. BookEase connects you to exceptional hotels with the simplicity and speed you expect from modern technology.
                    </p>
                    <button onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                        className='mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#85A4E1]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer'>
                        Explore Hotels →
                    </button>
                </div>
            </section>

            {/* Why BookEase */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-white'>
                <div className='text-center mb-14'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>✦ Why Choose Us</p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>Everything you need, nothing you don't</h2>
                    <p className='text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed'>
                        We've stripped away the complexity of hotel booking and kept only what matters.
                    </p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>
                    {experiences.map((e, i) => (
                        <div key={i} className='bg-slate-50 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'>
                            <div className='text-3xl mb-4'>{e.icon}</div>
                            <h3 className='font-bold text-gray-800 mb-2'>{e.title}</h3>
                            <p className='text-sm text-gray-500 leading-relaxed'>{e.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-slate-50'>
                <div className='text-center mb-14'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>✦ How It Works</p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>Book in four simple steps</h2>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto'>
                    {steps.map((s, i) => (
                        <div key={i} className='relative bg-white rounded-2xl p-6 shadow-sm text-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#5b7fe8] to-[#85A4E1] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#85A4E1]/30'>
                                {s.num}
                            </div>
                            <h3 className='font-bold text-gray-800 mb-2'>{s.title}</h3>
                            <p className='text-sm text-gray-500 leading-relaxed'>{s.desc}</p>
                            {i < steps.length - 1 && (
                                <div className='hidden lg:block absolute top-10 -right-3 text-gray-300 text-2xl'>→</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className='bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] py-16 px-6 md:px-16 lg:px-24'>
                <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center'>
                    {[['10K+','Hotels Listed'],['190+','Cities'],['50K+','Happy Travelers'],['4.9★','Average Rating']].map(([val, label]) => (
                        <div key={label}>
                            <p className='text-3xl md:text-4xl font-bold'>{val}</p>
                            <p className='text-white/75 text-sm mt-1'>{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-white text-center'>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>Ready to find your perfect stay?</h2>
                <p className='text-gray-500 mt-3 max-w-md mx-auto text-sm leading-relaxed'>
                    Thousands of hotels are waiting. Your next great experience is one search away.
                </p>
                <button onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                    className='mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-[#85A4E1]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer text-base'>
                    Browse Hotels →
                </button>
            </section>
        </div>
    );
};

export default Experience;
