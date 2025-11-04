import React, { useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import Navbar from './Navbar';

const About = () => {
  useEffect(() => {
    document.title = "Tirashop - About";
  }, []);
  const features = [
    {
      icon: "ri-leaf-line",
      title: "Fresh Ingredients",
      description: "We source the finest, freshest ingredients daily to ensure every bite is bursting with natural flavors and nutritional goodness."
    },
    {
      icon: "ri-heart-line",
      title: "Made with Love",
      description: "Every pastry is crafted by hand with passion and dedication, bringing you authentic taste and traditional baking techniques."
    },
    {
      icon: "ri-shield-check-line",
      title: "Quality Guaranteed",
      description: "Our commitment to excellence ensures consistent quality in every product, meeting the highest standards of taste and freshness."
    },
    {
      icon: "ri-time-line",
      title: "Daily Fresh Baking",
      description: "All our products are baked fresh daily in small batches to maintain optimal taste, texture, and aroma."
    },
    {
      icon: "ri-award-line",
      title: "Award Winning",
      description: "Recognition from culinary experts and countless satisfied customers validate our dedication to exceptional baking craftsmanship."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Personal Service",
      description: "Our friendly team provides personalized service, helping you find the perfect treats for any occasion or dietary preference."
    }
  ];

  const stats = [
    { number: "15+", label: "Years of Experience" },
    { number: "500+", label: "Daily Fresh Pastries" },
    { number: "100%", label: "Natural Ingredients" },
    { number: "5000+", label: "Happy Customers" }
  ];

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <div className="flex items-center">
          <a className="hover:text-pink-600 transition-colors" href="/">
            Home
          </a>
        </div>
        <div className="flex items-center">
          <i className="ri-arrow-right-s-line mx-2"></i>
          <span className="text-pink-600 font-semibold">About</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-96 rounded-2xl overflow-hidden mb-12 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Tirashop</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Crafting sweet memories with every delicious bite since 2008
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-rose-600 mb-6">Our Story</h2>
          <div className="space-y-4 text-orange-600 leading-snug">
            <p>
              Founded in 2008 by master baker Maria Delacroix, Tirashop began as a small 
              neighborhood bakery with a simple mission: to bring the authentic taste of 
              European pastries to our community. What started as a dream in a tiny kitchen 
              has grown into a beloved destination for pastry lovers.
            </p>
            <p>
              Every morning at 4 AM, our skilled bakers begin the careful process of creating 
              each pastry by hand, using time-honored recipes passed down through generations. 
              We believe that great baking is an art form that requires patience, precision, 
              and most importantly, love.
            </p>
            <p>
              Today, Tirashop continues to uphold the same values that made us who we are: 
              uncompromising quality, authentic flavors, and a commitment to making every 
              customer feel like family. From our signature croissants to our decadent 
              chocolate tarts, every item reflects our dedication to excellence.
            </p>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Master baker at work" 
            className="rounded-xl shadow-lg w-full h-96 object-cover object-top"
          />
        </div>
      </div>

      {/* Why Choose Tirashop Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Tirashop?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what makes our bakery special and why customers keep coming back for more
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <i className={`${feature.icon} text-2xl text-pink-600`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-pink-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;