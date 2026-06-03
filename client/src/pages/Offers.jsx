import React, { useState } from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import AnimateIn, { StaggerContainer, StaggerItem } from '../components/AnimateIn'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'

const Offers = () => {
    const { navigate, axios, toast } = useAppContext();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { data } = await axios.post('/api/newsletter/subscribe', { email });
            if (data.success) {
                toast.success(data.message || 'You\'re subscribed! Check your inbox 🎉');
                setEmail("");
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
        <AnimateIn as='div' variant='fadeUpSoft' className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
                <Title 
                    title='Exclusive Offers' 
                    subTitle='Discover our curated selection of limited-time deals and specialized travel packages designed for every type of traveler.' 
                    align='left' 
                />
            </div>

            <StaggerContainer className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {exclusiveOffers.map((item) => (
                    <StaggerItem key={item._id} variant='fadeUp'>
                        <div className='group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2'>
                            {/* Image Section */}
                            <div className='relative h-64 overflow-hidden'>
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' 
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                <div className='absolute top-4 left-4 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg'>
                                    {item.priceOff}% OFF
                                </div>
                                <div className='absolute bottom-4 left-4 right-4'>
                                    <p className='text-white/80 text-xs font-bold uppercase tracking-widest mb-1'>Limited Time Offer</p>
                                    <h3 className='text-white text-2xl font-playfair font-bold leading-tight'>{item.title}</h3>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className='p-6 flex flex-col h-full'>
                                <p className='text-gray-500 text-sm leading-relaxed mb-6'>
                                    {item.description}. Experience the ultimate comfort and luxury with our specialized packages tailored just for you.
                                </p>
                                
                                <div className='mt-auto flex items-center justify-between pt-6 border-t border-gray-50'>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter'>Valid Until</span>
                                        <span className='text-sm font-bold text-gray-700'>{item.expiryDate}, 2026</span>
                                    </div>
                                    <button 
                                        onClick={() => { navigate('/rooms'); scrollTo(0, 0); }}
                                        className='inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#5b7fe8] transition-all active:scale-95'
                                    >
                                        Redeem Offer
                                        <img src={assets.arrowIcon} alt="" className='h-2.5 invert group-hover:translate-x-1 transition-transform' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Newsletter Integration */}
            <div className='mt-24 bg-gradient-to-br from-[#5b7fe8]/5 to-[#85A4E1]/10 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-[#85A4E1]/10'>
                <div className='flex-1 text-center md:text-left'>
                    <h3 className='text-3xl font-playfair font-bold text-gray-900 mb-4'>Don't miss out on future deals</h3>
                    <p className='text-gray-500 text-sm max-w-md'>Subscribe to our newsletter and be the first to know about exclusive discounts, member-only rates, and secret getaway packages.</p>
                </div>
                <div className='flex-1 w-full max-w-md'>
                    <form onSubmit={handleSubscribe} className='bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-gray-100'>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className='flex-1 px-4 py-3 outline-none text-sm'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className='bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#5b7fe8] transition-all shrink-0 active:scale-95 disabled:opacity-60'
                        >
                            {loading ? 'Subscribing...' : 'Join Now'}
                        </button>
                    </form>
                </div>
            </div>
        </AnimateIn>
    )
}

export default Offers
