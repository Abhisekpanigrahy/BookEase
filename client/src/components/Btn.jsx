import React from 'react';

/**
 * Shared Button component — single source of truth for all button styles.
 *
 * variant:
 *   "primary"   – solid indigo-blue gradient  (main CTAs)
 *   "secondary" – white background, colored border  (secondary actions)
 *   "ghost"     – transparent, colored text, no border  (subtle actions)
 *   "danger"    – red gradient  (destructive / pay now)
 *   "success"   – green  (status badges — non-interactive)
 *   "warning"   – amber  (status badges — non-interactive)
 *
 * size:  "sm" | "md" | "lg"
 */
const variants = {
    primary:
        'inline-flex items-center justify-center gap-2 font-semibold text-white ' +
        'bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] ' +
        'hover:from-[#4a6edb] hover:to-[#6b8fd4] ' +
        'shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:shadow-[#85A4E1]/40 ' +
        'hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ' +
        'rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',

    secondary:
        'inline-flex items-center justify-center gap-2 font-semibold ' +
        'text-[#5b7fe8] border-2 border-[#85A4E1] bg-white ' +
        'hover:bg-[#85A4E1] hover:text-white ' +
        'shadow-sm hover:shadow-md hover:shadow-[#85A4E1]/30 ' +
        'hover:-translate-y-0.5 active:translate-y-0 ' +
        'rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',

    dark:
        'inline-flex items-center justify-center gap-2 font-semibold text-white ' +
        'bg-gradient-to-r from-gray-900 to-gray-700 ' +
        'hover:from-gray-700 hover:to-gray-900 ' +
        'shadow-md hover:shadow-lg ' +
        'hover:-translate-y-0.5 active:translate-y-0 ' +
        'rounded-full transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',

    darkOutline:
        'inline-flex items-center justify-center gap-2 font-semibold ' +
        'border-2 border-gray-800 text-gray-800 bg-transparent ' +
        'hover:bg-gray-800 hover:text-white ' +
        'rounded-full transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',

    ghost:
        'inline-flex items-center justify-center gap-2 font-medium ' +
        'text-[#5b7fe8] bg-transparent hover:bg-[#85A4E1]/10 ' +
        'rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',

    danger:
        'inline-flex items-center justify-center gap-2 font-semibold text-white ' +
        'bg-gradient-to-r from-rose-500 to-red-400 ' +
        'hover:from-rose-600 hover:to-red-500 ' +
        'shadow-md shadow-rose-400/30 hover:shadow-lg hover:shadow-rose-400/40 ' +
        'hover:-translate-y-0.5 active:translate-y-0 ' +
        'rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',

    white:
        'inline-flex items-center justify-center gap-2 font-semibold ' +
        'bg-white text-gray-900 ' +
        'hover:bg-gray-50 shadow-sm hover:shadow-md ' +
        'hover:-translate-y-0.5 active:translate-y-0 ' +
        'rounded-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',

    whiteOutline:
        'inline-flex items-center justify-center gap-2 font-medium ' +
        'bg-white/10 border border-white/30 text-white backdrop-blur-sm ' +
        'hover:bg-white hover:text-gray-900 ' +
        'rounded-full transition-all duration-200 active:scale-95 cursor-pointer',
};

const sizes = {
    xs:  'text-xs  px-3   py-1.5',
    sm:  'text-sm  px-4   py-2',
    md:  'text-sm  px-6   py-2.5',
    lg:  'text-base px-8  py-3',
};

const Btn = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => (
    <button
        className={`${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default Btn;
