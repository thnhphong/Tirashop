import React, { useState, useEffect} from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  //show button when page is scrolled down
  const toggleVisibility = () => {
    if(window.pageYOffset > 300){
      setVisible(true)
    }else {
      setVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  })
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <div className="relative">
          <button 
            onClick={scrollToTop} 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-200">
              <span className="tooltip-text">☝️ Scroll to Top</span>
              {/* Arrow pointing down to button */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScrollToTopButton;