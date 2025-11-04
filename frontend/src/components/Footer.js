import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo + About */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <i className="ri-cake-3-fill text-white text-xl"></i>
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "Pacifico, serif" }}
              >
                Tirashop
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-snug">
              Crafting the finest pastries with passion and tradition since 2008.
              Every bite tells a story of excellence.
            </p>
            <div className="flex space-x-4">
              <a
                href="#Home"
                className="w-10 h-10 bg-gray-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a
                href="#Home"
                className="w-10 h-10 bg-gray-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-instagram-line"></i>
              </a>
              <a
                href="#Home"
                className="w-10 h-10 bg-gray-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-twitter-fill"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Our Products
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Catering
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Pastries
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Cakes
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Breads
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Desserts
                </a>
              </li>
              <li>
                <a
                  href="#Home"
                  className="text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Seasonal Specials
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="ri-map-pin-line text-rose-400 mt-1"></i>
                <p className="text-gray-300">
                  123 Baker Street
                  <br />
                  Paris, France 75001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-phone-line text-rose-400"></i>
                <p className="text-gray-300">+33 1 42 36 70 40</p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-mail-line text-rose-400"></i>
                <p className="text-gray-300">hello@tirashop.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-time-line text-rose-400"></i>
                <p className="text-gray-300">
                  Mon-Fri: 7AM-8PM
                  <br />
                  Sat-Sun: 8AM-9PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Tirashop. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#Home"
              className="text-gray-400 hover:text-rose-400 text-sm transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="Home"
              className="text-gray-400 hover:text-rose-400 text-sm transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <a
              href="#Home"
              className="text-gray-400 hover:text-rose-400 text-sm transition-colors cursor-pointer"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
