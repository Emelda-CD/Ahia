import React from 'react';

const Logo = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => {
  const spanStyle = variant === 'dark' 
    ? { color: 'white' } 
    : {
        background: 'linear-gradient(to right, #591942, #D946EF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };

  return (
    <div className="flex items-center gap-2 font-bold">
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="url(#grad)"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#591942" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50 95C50 95 10 65 10 35A40 40 0 1 1 90 35C90 65 50 95 50 95ZM50 53C59.9411 53 68 44.9411 68 35C68 25.0589 59.9411 17 50 17C40.0589 17 32 25.0589 32 35C32 44.9411 40.0589 53 50 53Z"
        />
        <path
          d="M85 30 C 70 55, 60 60, 50 55"
          stroke="url(#grad)"
          strokeWidth="8"
          fill="none"
        />
      </svg>
      <span className="text-2xl" style={spanStyle}>
        Ahia
      </span>
    </div>
  );
};

export default Logo;
