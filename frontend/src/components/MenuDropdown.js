import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const MenuDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback categories if API fails
        setCategories([
          { id: 1, name: 'breads' },
          { id: 2, name: 'cakes' },
          { id: 3, name: 'pastries' },
          { id: 4, name: 'desserts' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.menu-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="relative menu-dropdown mb-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-gray-800 hover:text-rose-500 font-medium transition-colors flex items-center mt-1"
        style={{ fontFamily: "Rosario, sans-serif" }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Menu
        <i className={`ri-arrow-down-s-line ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0  w-64 bg-white rounded-lg shadow-lg border border-rose-100 py-2 z-50 animate-fade-in">
          {/* All Products Link */}
          <Link
            to="/menu/all"
            className={`block px-4 py-3 text-sm font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors ${
              location.pathname === '/menu/all' ? 'text-rose-600 bg-rose-50' : 'text-gray-700'
            }`}
            style={{ fontFamily: "Rosario, sans-serif" }}
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center">
              <i className="ri-apps-2-line mr-3 text-rose-500"></i>
              <div>
                <div className="font-semibold">All Products</div>
                <div className="text-xs text-gray-500">Browse everything</div>
              </div>
            </div>
          </Link>

          {/* Divider */}
          <hr className="my-2 border-rose-100" />

          {/* Dynamic Categories */}
          {categories.map((category) => {
            const categoryPath = `/menu/${category.name.toLowerCase()}`;
            const isActive = location.pathname === categoryPath;
            
            // Define icons for different categories
            const getIcon = (categoryName) => {
              const name = categoryName.toLowerCase();
              switch (name) {
                case 'breads': return 'ri-restaurant-line';
                case 'cakes': return 'ri-cake-3-line';
                case 'pastries': return 'ri-cookie-line';
                case 'desserts': return 'ri-heart-3-line';
                case 'coffee': return 'ri-cup-line';
                case 'tea': return 'ri-leaf-line';
                case 'sandwiches': return 'ri-sandwich-line';
                case 'drinks': return 'ri-drink-2-line';
                default: return 'ri-store-3-line';
              }
            };

            return (
              <Link
                key={category.id}
                to={categoryPath}
                className={`block px-4 py-3 text-sm font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors ${
                  isActive ? 'text-rose-600 bg-rose-50' : 'text-gray-700'
                }`}
                style={{ fontFamily: "Rosario, sans-serif" }}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <i className={`${getIcon(category.name)} mr-3 text-rose-500`}></i>
                  <div>
                    <div className="font-semibold capitalize">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-gray-500">{category.description}</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* View All Menu Link */}
          <hr className="my-2 border-rose-100" />
          <Link
            to="/menu/all"
            className="block px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            style={{ fontFamily: "Rosario, sans-serif" }}
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center">
              <span>View Full Menu</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;