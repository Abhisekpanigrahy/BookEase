import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable scroll-triggered animation wrapper.
 *
 * variant presets:
 *   fadeUp    – fade in + slide up (default)
 *   fadeDown  – fade in + slide down
 *   fadeLeft  – fade in + slide from left
 *   fadeRight – fade in + slide from right
 *   fade      – pure fade (no movement)
 *   scaleUp   – scale from 0.92 + fade
 *   stagger   – use on parent; children animate in sequence via `staggerChildren`
 */

const variants = {
    fadeUp:      { hidden: { opacity: 0, y: 32 },        visible: { opacity: 1, y: 0 } },
    fadeUpSoft:  { hidden: { opacity: 0, y: 24 },        visible: { opacity: 1, y: 0 } },
    fadeDown:    { hidden: { opacity: 0, y: -24 },       visible: { opacity: 1, y: 0 } },
    fadeLeft:    { hidden: { opacity: 0, x: -50 },       visible: { opacity: 1, x: 0 } },
    fadeRight:   { hidden: { opacity: 0, x: 50 },        visible: { opacity: 1, x: 0 } },
    fade:        { hidden: { opacity: 0 },                visible: { opacity: 1 } },
    scaleUp:     { hidden: { opacity: 0, scale: 0.94 },   visible: { opacity: 1, scale: 1 } },
    popIn:       { hidden: { opacity: 0, scale: 0.96, y: 12 }, visible: { opacity: 1, scale: 1, y: 0 } },
    stagger:     {
        hidden:  {},
        visible: { transition: { staggerChildren: 0.12 } },
    },
};

const defaultTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] };

const AnimateIn = ({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 0.55,
    className = '',
    once = true,
    as: Tag = 'div',
    ...props
}) => {
    const MotionTag = motion[Tag] || motion.div;

    return (
        <MotionTag
            className={className}
            initial='hidden'
            whileInView='visible'
            viewport={{ once, margin: '-60px' }}
            variants={variants[variant]}
            transition={{ ...defaultTransition, duration, delay }}
            {...props}
        >
            {children}
        </MotionTag>
    );
};

export const PageTransition = ({ children, variant = 'fadeUp', duration = 0.45, className = '', as: Tag = 'div', ...props }) => {
    const MotionTag = motion[Tag] || motion.div;

    return (
        <MotionTag
            className={className}
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={variants[variant]}
            transition={{ ...defaultTransition, duration }}
            {...props}
        >
            {children}
        </MotionTag>
    );
};

/** Stagger container — wraps children that should animate in sequence */
export const StaggerContainer = ({ children, className = '', delay = 0, staggerDelay = 0.12, once = true }) => (
    <motion.div
        className={className}
        initial='hidden'
        whileInView='visible'
        viewport={{ once, margin: '-60px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } } }}
    >
        {children}
    </motion.div>
);

/** Item for use inside StaggerContainer */
export const StaggerItem = ({ children, className = '', variant = 'fadeUp' }) => (
    <motion.div className={className} variants={variants[variant]}>
        {children}
    </motion.div>
);

export default AnimateIn;
