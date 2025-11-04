import React from 'react';

const ScrollDownButton = ({ scrollAmount = 700 }) => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.scrollY + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div 
        className="w-8 h-8 border-2 border-rose-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-400 hover:text-white transition-colors duration-300"
        onClick={handleScrollDown}
      >
        <svg 
          className="w-4 h-4 text-rose-400 hover:text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default ScrollDownButton;