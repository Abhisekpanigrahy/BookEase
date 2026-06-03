import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const NewsLetter = () => {
    const { axios } = useAppContext();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { data } = await axios.post('/api/newsletter/subscribe', { email });
            if (data.success) {
                setSubmitted(true);
                toast.success('You\'re subscribed! Check your inbox 🎉');
            } else {
                toast.error(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Subscription failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-white'>
            <div className='relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl px-8 md:px-16 py-16 overflow-hidden'>

                {/* Decorative blobs */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[#85A4E1]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none' />
                <div className='absolute bottom-0 left-0 w-72 h-72 bg-[#85A4E1]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none' />
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(133,164,225,0.05)_0%,transparent_70%)] pointer-events-none' />

                <div className='relative z-10 flex flex-col items-center text-center'>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-3'>
                        ✦ Stay in the Loop
                    </p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-white max-w-xl leading-tight'>
                        Get Exclusive Deals &amp; Travel Inspiration
                    </h2>
                    <p className='text-white/60 text-sm mt-3 max-w-md leading-relaxed'>
                        Join 50,000+ travelers who receive our weekly curated deals, destination guides, and members-only offers.
                    </p>

                    {submitted ? (
                        <div className='mt-8 bg-white/10 border border-white/20 rounded-2xl px-10 py-6 text-white'>
                            <p className='text-2xl mb-1'>🎉</p>
                            <p className='text-lg font-playfair font-semibold'>You&apos;re subscribed!</p>
                            <p className='text-sm text-white/60 mt-1'>Check your inbox for a welcome surprise.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-md p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm'>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className='flex-1 bg-transparent border-none text-white placeholder:text-white/40 px-4 py-3 text-sm outline-none disabled:opacity-60'
                                placeholder='Enter your email address'
                            />
                            <button
                                type='submit'
                                disabled={loading}
                                className='flex items-center justify-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] disabled:opacity-60 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#85A4E1]/30 hover:shadow-xl hover:shadow-[#85A4E1]/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer'>
                                {loading ? (
                                    <span className='flex items-center gap-2'>
                                        <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                                        </svg>
                                        Subscribing…
                                    </span>
                                ) : (
                                    <>
                                        Subscribe
                                        <img src={assets.arrowIcon} alt="" className='w-3 invert' />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Trust row */}
                    <div className='flex flex-wrap items-center justify-center gap-6 mt-8 text-white/40 text-xs'>
                        <span>✓ No spam, ever</span>
                        <span>✓ Unsubscribe anytime</span>
                        <span>✓ 50K+ subscribers</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsLetter;
