import React, { useState } from 'react';
import AnimateIn, { StaggerContainer, StaggerItem } from './AnimateIn';

const faqs = [
    {
        q: 'How do I book a hotel on BookEase?',
        a: 'Simply search for your destination, choose your check-in and check-out dates, pick a room that suits you, and complete the secure checkout with Stripe. You\'ll receive an email confirmation instantly.'
    },
    {
        q: 'Can I cancel or modify my booking?',
        a: 'Yes. Visit "My Bookings" from your profile menu. Cancellation policies vary by property — free cancellation options are clearly marked on each listing before you book.'
    },
    {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payments are processed through Stripe, a PCI-DSS Level 1 certified payment provider. BookEase never stores your card details on our servers.'
    },
    {
        q: 'How do I list my hotel on BookEase?',
        a: 'Once logged in, click "List Your Hotel" in the navigation bar. Complete the hotel registration form and you can start adding rooms, setting prices, and receiving bookings immediately.'
    },
    {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) through Stripe. Some properties also offer a "Pay at Hotel" option at checkout.'
    },
    {
        q: 'Will I get a confirmation after booking?',
        a: 'Yes — a detailed booking confirmation email is sent to your registered email address immediately after a successful payment, including your reservation ID, dates, and property details.'
    },
    {
        q: 'How does BookEase ensure hotel quality?',
        a: 'Every property on our platform is reviewed against our quality standards. Verified guest ratings and reviews are displayed on each listing so you can book with confidence.'
    },
    {
        q: 'Can I book for multiple guests?',
        a: 'Yes, simply set the number of guests in the search form. Room capacity is clearly shown on each listing, and pricing updates accordingly.'
    },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md' : 'shadow-sm'}`}>
        <button
            className='w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer'
            onClick={onToggle}
            aria-expanded={isOpen}
        >
            <span className={`font-semibold text-sm md:text-base pr-4 ${isOpen ? 'text-[#85A4E1]' : 'text-gray-800'}`}>
                {q}
            </span>
            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl font-light transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-[#85A4E1] to-[#6b8fd4] text-white rotate-45 shadow-md shadow-[#85A4E1]/30' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                +
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
            <p className='px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4'>
                {a}
            </p>
        </div>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className='px-6 md:px-16 lg:px-24 py-20 bg-slate-50'>
            {/* Header */}
            <AnimateIn className='flex flex-col items-center text-center mb-14'>
                <p className='text-xs font-semibold uppercase tracking-widest text-[#85A4E1] mb-2'>
                    ✦ Got Questions?
                </p>
                <h2 className='font-playfair text-3xl md:text-4xl font-bold text-gray-900'>
                    Frequently Asked Questions
                </h2>
                <p className='text-gray-500 mt-3 max-w-lg text-sm leading-relaxed'>
                    Everything you need to know about booking, payments, and managing your stay with BookEase.
                </p>
            </AnimateIn>

            {/* Two-column grid on large screens */}
            <StaggerContainer className='grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto' staggerDelay={0.07}>
                {faqs.map((item, i) => (
                    <StaggerItem key={i} variant='fadeUp'>
                        <FAQItem
                            q={item.q}
                            a={item.a}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* CTA */}
            <AnimateIn delay={0.2} className='flex flex-col items-center mt-12 gap-3'>
                <p className='text-gray-500 text-sm'>Still have questions?</p>
                <a
                    href="mailto:abhisekpanigrahy79@gmail.com"
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-[#85A4E1] to-[#6b8fd4] hover:from-[#6b8fd4] hover:to-[#5a7ec3] text-white text-sm font-bold px-7 py-3 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:shadow-[#85A4E1]/50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95'>
                    Contact Support →
                </a>
            </AnimateIn>
        </section>
    );
};

export default FAQ;
