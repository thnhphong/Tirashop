import React from 'react';

const BakeryCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Bread',
      image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Cake',
      image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Sandwich',
      image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Pastry',
      image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-amber-100 to-amber-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-6">
            Bakery
          </h2>
          <p className="text-lg text-amber-800 max-w-4xl mx-auto leading-relaxed">
            At Tirashop, we offer a wide range of bakery items that are perfect for any occasion. 
            From our freshly baked breads to our decadent cakes and pastries, each of our products 
            is made with the finest ingredients and the utmost care.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-amber-50/50 backdrop-blur-sm p-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl w-48 h-48 mx-auto">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-amber-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <span className="text-white text-sm font-medium tracking-wider">
                      VIEW {category.name.toUpperCase()}
                    </span>
                    <div className="w-12 h-0.5 bg-white mt-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Category Name */}
              <h3 className="text-xl font-serif text-amber-900 group-hover:text-amber-700 transition-colors duration-300">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BakeryCategories;