import React from 'react';
import heroImg from '../assets/images/hero.jpg';
import ScrollDownButton from './ScrollDownButton';

const Hero = () => {
  const stats = [
    {
      icon: "ri-award-fill",
      iconColor: "text-rose-500",
      bgColor: "bg-rose-100",
      number: "15+",
      label: "Years of Excellence"
    },
    {
      icon: "ri-cake-3-fill", 
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      number: "200+",
      label: "Daily Fresh Pastries"
    },
    {
      icon: "ri-leaf-fill",
      iconColor: "text-green-600", 
      bgColor: "bg-green-100",
      number: "100%",
      label: "Natural Ingredients"
    },
    {
      icon: "ri-heart-fill",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100", 
      number: "5000+",
      label: "Happy Customers"
    }
  ];

  return (
    <div 
  className="relative min-h-screen flex items-center justify-center overflow-hidden" 
   style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 240, 245, 0.8) 50%, rgba(255, 255, 255, 0.9) 100%), url(${heroImg})`,
      }}
    >
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="text-center lg:text-left">
          <h1 
            className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: 'Rosario, sans-serif' }}
          >
            <span className="block text-gray-800">Warm, flaky,</span>
            <span className="block bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              and made with love.
            </span>
          </h1>
          
          <p 
            className="text-xl text-orange-600 mb-8 leading-relaxed"
            style={{ fontFamily: 'Rosario, sans-serif' }}
          >
            Artisanal pastries crafted daily with premium ingredients. From buttery croissants to decadent cakes, every bite tells a story of passion and perfection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md px-8 py-4 text-lg shadow-lg">
              Shop pastries
              <i className="ri-arrow-right-line ml-2"></i>
            </button>
            
            <button className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg">
              View menu
            </button>
          </div>
        </div>

        {/* Right Column - Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-rose-100"
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${stat.icon} ${stat.iconColor} text-xl`}></i>
              </div>
              
              <h3 
                className="text-2xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'Rosario, sans-serif' }}
              >
                {stat.number}
              </h3>
              
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Rosario, sans-serif' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
      <ScrollDownButton />
      </div>
  );
};

export default Hero;