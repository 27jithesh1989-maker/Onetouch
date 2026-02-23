import React from 'react';

const Logo = ({ size = 28, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Circle Arc for 'Touch' */}
            <path
                d="M50 20 C65 20 75 30 75 45"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
            />
            <circle cx="50" cy="20" r="5" fill="currentColor" />

            {/* Hand Minimalist Shape */}
            <path
                d="M45 85 L45 35 C45 30 55 30 55 35 L55 60 L65 55 C70 52 75 55 75 62 L75 85 Z"
                fill="currentColor"
            />
            <path
                d="M45 65 L35 55 C32 52 28 55 30 58 L45 75"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Logo;
