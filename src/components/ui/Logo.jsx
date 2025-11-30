import React from 'react';

export const Logo = ({ className = "w-7 h-7", fill = "currentColor" }) => {
    return (
        <svg 
            className={className} 
            viewBox="0 0 24 24" 
            fill={fill} 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.59 3.38 17.1L2.12 21.08C2.02 21.4 2.31 21.7 2.64 21.61L6.79 20.52C8.34 21.46 10.12 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.5 10.5H17L11 18.5V12.5H8.5L14.5 4.5V10.5Z" 
            />
        </svg>
    );
};

export const LogoContainer = ({ children, className = "" }) => {
    return (
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 relative z-10 border border-white/20 ${className}`}>
            {children}
        </div>
    );
};
