import React from 'react';

const BeverageCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Coffee',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Tea',
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Blended',
      image: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-200 to-gray-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-700 mb-6">
            Beverage
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From bold espresso, to handcrafted smoothies, our beverages a perfect accompaniment to our artisan baked goods.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-100/50 backdrop-blur-sm p-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl w-48 h-48 mx-auto">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gray-700/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <span className="text-white text-sm font-medium tracking-wider">
                      VIEW {category.name.toUpperCase()}S
                    </span>
                    <div className="w-12 h-0.5 bg-white mt-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Category Name */}
              <h3 className="text-xl font-serif text-gray-700 group-hover:text-gray-600 transition-colors duration-300">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeverageCategories;