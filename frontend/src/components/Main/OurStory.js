import React from "react";
import "remixicon/fonts/remixicon.css";
import staffImg from '../../assets/images/bakerystaff.jpg';


const OurStory = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2
              className="text-4xl font-bold text-rose-600 mb-6"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Our Story
            </h2>
            <p
              className="text-lg text-orange-600 mb-6 leading-relaxed"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Founded in 2008 by master baker Marie Dubois, Tirashop began as a
              small neighborhood bakery with a simple mission: to create the
              finest pastries using traditional French techniques and the
              freshest local ingredients.
            </p>
            <p
              className="text-lg text-orange-600 mb-8 leading-relaxed"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Today, we continue that tradition, combining time-honored recipes
              with innovative flavors to delight our customers. Every croissant,
              cake, and pastry that leaves our kitchen carries with it our
              commitment to excellence and our love for the craft of baking.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div
                  className="text-3xl font-bold text-rose-500 mb-2"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  15+
                </div>
                <div
                  className="text-gray-600"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Years of Excellence
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold text-rose-500 mb-2"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  50K+
                </div>
                <div
                  className="text-gray-600"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Happy Customers
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                alt="Our bakery story"
                className="w-full h-[500px] object-cover  object-top"
                src={staffImg}
              />

              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-rose-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <i className="ri-cake-3-fill text-rose-500 text-xl"></i>
                  </div>
                  <div>
                    <h4
                      className="font-bold text-gray-800"
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      Marie Dubois
                    </h4>
                    <p
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      Master Baker & Founder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="ri-leaf-fill text-rose-500 text-2xl"></i>
            </div>
            <h3
              className="text-xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Fresh Ingredients
            </h3>
            <p
              className="text-gray-600 text-base leading-tight font-medium"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              We source the finest, freshest ingredients from local suppliers to
              ensure exceptional quality in every bite.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="ri-time-fill text-rose-500 text-2xl"></i>
            </div>
            <h3
              className="text-xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Daily Baked
            </h3>
            <p
              className="text-gray-600 text-base leading-tight font-medium"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              All our pastries are baked fresh daily using traditional
              techniques passed down through generations.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="ri-award-fill text-rose-500 text-2xl"></i>
            </div>
            <h3
              className="text-xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Award Winning
            </h3>
            <p
              className="text-gray-600 text-base leading-tight font-medium"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Recognized for excellence in baking with multiple awards from
              culinary institutions and food critics.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="ri-heart-fill text-rose-500 text-2xl"></i>
            </div>
            <h3
              className="text-xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Made with Love
            </h3>
            <p
              className="text-gray-600 text-base leading-tight font-medium"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Every pastry is crafted with passion and attention to detail,
              bringing joy to our customers since 2008.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
