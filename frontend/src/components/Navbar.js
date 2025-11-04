import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import MenuDropdown from "./MenuDropdown";
import 'remixicon/fonts/remixicon.css';
import { useCart } from "../context/CartContext";
import CartPopup from "./CartPopup";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  
  const { getTotalItems, showCartPopup, setShowCartPopup } = useCart();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const cartCount = getTotalItems();
    console.log('Cart item count:', cartCount);
  }, [getTotalItems]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      console.log(token)
      if (token && token !== 'undefined' && token !== 'null' && token !== '') {
        try {
          const decoded = jwtDecode(token);
          setCustomerName(decoded.name || 'Guest');
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Invalid token:', err);
          setIsLoggedIn(false);
          setCustomerName('');
          localStorage.removeItem('token');
        }
      } else {
        setIsLoggedIn(false);
        setCustomerName('');
      }
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // Fetch categories for mobile menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
       const response = await axios.get('http://localhost:5001/api/categories');
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('API did not return an array:', response.data);
        // Fallback to default categories
        setCategories([
          { id: 1, name: 'breads' },
          { id: 2, name: 'cakes' },
          { id: 3, name: 'pastries' },
          { id: 4, name: 'sandwiches' },
          { id: 5, name: 'coffee' },
          { id: 6, name: 'tea' },
          { id: 7, name: 'blended drinks' },
        ]);
      }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback categories if API fails
        setCategories([
        { id: 1, name: 'breads' },
        { id: 2, name: 'cakes' },
        { id: 3, name: 'pastries' },
        { id: 4, name: 'sandwiches' },
        { id: 5, name: 'coffee' },
        { id: 6, name: 'tea' },
        { id: 7, name: 'blended drinks' },
      ]);
      }
    };
    
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCustomerName('');
    window.location.href = '/';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Navigate to menu with search parameter
      window.location.href = `/menu/all?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-rose-100"
          : "bg-gradient-to-b from-white to-white/90"
      }`}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
              <i className="ri-cake-3-fill text-white text-xl"></i>
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent" style={{fontFamily: "Pacifico, serif" }}>
              Tirashop
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-rose-500 font-medium transition-colors"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Home
            </Link>
            <MenuDropdown />
            {isLoggedIn && (
              <Link
                to="/favorites"
                className="text-gray-700 hover:text-rose-500 font-medium transition-colors"
                style={{ fontFamily: "Rosario, sans-serif" }}
              >
                Favorites
              </Link>
            )}
            <Link
              to="/about"
              className="text-gray-700 hover:text-rose-500 font-medium transition-colors"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-rose-500 font-medium transition-colors"
              style={{ fontFamily: "Rosario, sans-serif" }}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64">
              <input
                placeholder="Search pastries..."
                className="w-full px-4 py-2 pr-10 text-sm bg-white border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400 hover:text-rose-600 cursor-pointer"
              >
                <i className="ri-search-line text-sm"></i>
              </button>
            </form>
            
            <div className="relative cursor-pointer">
              <div 
                className="w-10 h-10 bg-rose-50 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setShowCartPopup(prev => !prev)}
                aria-label="Toggle cart"
              >
                <i className="ri-shopping-bag-line text-rose-500 text-xl"></i>
              </div>
              <span  
                key={getTotalItems()} 
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {getTotalItems()}
              </span>
              {showCartPopup && <CartPopup />}
            </div>
            
            <div className="hidden lg:flex items-center space-x-2">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="whitespace-nowrap font-medium transition-all duration-200 rounded-full border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="whitespace-nowrap font-medium transition-all duration-200 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md px-4 py-2 text-sm"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span
                    className="text-gray-700 font-medium flex items-center space-x-2"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    {customerName}
                    <div className="w-8 h-8 bg-rose-50 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors cursor-pointer" onClick={() => {
                        const token = localStorage.getItem("token");
                        const user = JSON.parse(localStorage.getItem("user"));
                        if (token && user && user.id) {
                          window.location.href = `/profile/${user.id}`;
                        } else {
                          window.location.href = "/login";
                        }
                    }}>
                        <i className="ri-user-line text-sm"></i>
                    </div>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden w-10 h-10 bg-rose-50 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className={isMobileMenuOpen ? "ri-close-line text-rose-500 text-xl" : "ri-menu-line text-rose-500 text-xl"}></i>
            </button>
          </div>
        </div>
        
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              placeholder="Search pastries..."
              className="w-full px-4 py-2 pr-10 text-sm bg-white border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <i className="ri-search-line text-sm"></i>
            </button>
          </form>
        </div>
        
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-rose-500 font-semibold transition-colors py-2"
                style={{ fontFamily: "Rosario, sans-serif" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="border-l-2 border-rose-200 pl-4">
                <div
                  className="text-gray-800 font-semibold mb-2"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Menu
                </div>
                
                {/* All Categories Link */}
                <Link
                  to="/menu/all"
                  className={`block font-semibold text-gray-600 hover:text-rose-500 transition-colors py-1 text-sm ${
                    location.pathname === '/menu/all' ? 'text-rose-500 font-bold' : ''
                  }`}
                  style={{ fontFamily: "Rosario, sans-serif" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                
                {/* Dynamic Categories */}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/menu/${category.name.toLowerCase()}`}
                    className={`block font-semibold text-gray-600 hover:text-rose-500 transition-colors py-1 text-sm ${
                      location.pathname === `/menu/${category.name.toLowerCase()}` ? 'text-rose-500 font-bold' : ''
                    }`}
                    style={{ fontFamily: "Rosario, sans-serif" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </Link>
                ))}
              </div>
              
              {isLoggedIn && (
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-rose-500 font-medium transition-colors py-2"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="ri-heart-line mr-2"></i>Favorites
                </Link>
              )}
              
              <Link
                to="/about"
                className="text-gray-700 hover:text-rose-500 font-medium transition-colors py-2"
                style={{ fontFamily: "Rosario, sans-serif" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <Link
                to="/contact"
                className="text-gray-700 hover:text-rose-500 font-medium transition-colors py-2"
                style={{ fontFamily: "Rosario, sans-serif" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="flex space-x-2 pt-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="whitespace-nowrap font-medium transition-all duration-200 rounded-full border-2 border-orange-300 hover:border-orange-400 text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm flex-1 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="whitespace-nowrap font-medium transition-all duration-200 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md px-4 py-2 text-sm flex-1 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span
                      className="text-gray-700 font-medium"
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      Welcome, {customerName}
                      
                    </span>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-600 hover:text-gray-800 font-medium text-left"
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;