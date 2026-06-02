import React from 'react';

/**
 * BookEase brand logo.
 * variant="light"  → white text  (hero / transparent navbar)
 * variant="dark"   → dark text   (scrolled navbar)
 * variant="footer" → white text  (dark footer) — same as light
 */
const Logo = ({ variant = 'light', className = '' }) => {
    const isDark  = variant === 'dark';
    const text    = isDark ? '#1f2937' : '#ffffff';
    const accent  = '#5b7fe8';

    return (
        <svg
            width="150"
            height="36"
            viewBox="0 0 150 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="BookEase"
        >
            {/* ─── Square icon 36 × 36 ─── */}

            {/* Background square */}
            <rect width="36" height="36" rx="8" fill={accent} />

            {/* House / hotel shape */}
            {/* Roof triangle */}
            <polygon points="18,7 30,18 6,18" fill="white" opacity="0.95" />

            {/* Building body */}
            <rect x="9" y="18" width="18" height="11" rx="1" fill="white" opacity="0.90" />

            {/* Door */}
            <rect x="14.5" y="22" width="7" height="7" rx="1.5" fill={accent} />

            {/* Left window */}
            <rect x="10.5" y="20" width="4" height="3.5" rx="1" fill={accent} opacity="0.7" />

            {/* Right window */}
            <rect x="21.5" y="20" width="4" height="3.5" rx="1" fill={accent} opacity="0.7" />

            {/* ─── "BookEase" wordmark ─── */}
            <text
                x="44"
                y="25"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="20"
                fontWeight="700"
                fill={text}
                letterSpacing="0.3"
            >
                BookEase
            </text>
        </svg>
    );
};

export default Logo;
