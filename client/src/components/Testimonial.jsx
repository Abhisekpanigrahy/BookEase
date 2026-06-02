import React from 'react'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'
import AnimateIn, { StaggerContainer, StaggerItem } from './AnimateIn'

const Testimonial = () => {
    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-slate-50'>
            {/* Header */}
            <AnimateIn className='flex flex-col items-center text-center mb-12'>
                <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>
                    ✦ Guest Reviews
                </p>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>
                    What Our Guests Say
                </h2>
                <p className='text-gray-500 mt-2 max-w-lg text-sm leading-relaxed'>
                    Discover why discerning travelers consistently choose BookEase for their exclusive and luxurious accommodations around the world.
                </p>
            </AnimateIn>

            {/* Cards */}
            <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {testimonials.map((testimonial) => (
                    <StaggerItem key={testimonial.id} variant='scaleUp'>
                        <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4'>
                            <span className='text-5xl text-[#85A4E1]/30 font-serif leading-none'>"</span>
                            <p className='text-gray-600 text-sm leading-relaxed -mt-4'>{testimonial.review}</p>
                            <div className='flex items-center gap-0.5'><StarRating /></div>
                            <div className='flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto'>
                                <img className='w-10 h-10 rounded-full object-cover ring-2 ring-[#85A4E1]/30'
                                    src={testimonial.image} alt={testimonial.name} />
                                <div>
                                    <p className='font-semibold text-gray-800 text-sm'>{testimonial.name}</p>
                                    <p className='text-gray-400 text-xs'>{testimonial.address}</p>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
};

export default Testimonial;
