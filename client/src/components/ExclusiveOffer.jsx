import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import AnimateIn, { StaggerContainer, StaggerItem } from './AnimateIn'

const ExclusiveOffer = () => {
    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-white'>
            {/* Header */}
            <AnimateIn className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12'>
                <div>
                    <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>
                        ✦ Limited Time
                    </p>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>
                        Exclusive Offers
                    </h2>
                    <p className='text-gray-500 mt-2 max-w-md text-sm leading-relaxed'>
                        Limited-time packages designed to enhance your stay and create unforgettable memories.
                    </p>
                </div>
                <button className='shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] px-6 py-2.5 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:shadow-[#85A4E1]/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer'>
                    View All Offers
                    <span className='text-base leading-none'>→</span>
                </button>
            </AnimateIn>

            {/* Cards */}
            <StaggerContainer className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {exclusiveOffers.map((item) => (
                    <StaggerItem key={item._id} variant='scaleUp'>
                        <div
                            className='group relative rounded-2xl overflow-hidden h-72 cursor-pointer'
                            style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300' />
                            <div className='absolute top-4 left-4 bg-[#85A4E1] text-white text-xs font-bold px-3 py-1 rounded-full'>
                                {item.priceOff}% OFF
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                                <p className='text-xl font-playfair font-semibold leading-tight'>{item.title}</p>
                                <p className='text-sm text-white/75 mt-1'>{item.description}</p>
                                <div className='flex items-center justify-between mt-4'>
                                    <p className='text-xs text-white/50'>Expires {item.expiryDate}</p>
                                    <button className='flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 hover:bg-[#85A4E1] hover:text-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95'>
                                        View Offer
                                        <img className='h-2.5 group-hover:translate-x-0.5 transition-transform' src={assets.arrowIcon} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
};

export default ExclusiveOffer;
