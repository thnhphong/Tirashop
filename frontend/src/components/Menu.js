import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import { CartProvider, useCart } from '../context/CartContext';
import QuantityControl from './QuantityControl';
import CartPopup from './CartPopup';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import FavoriteBtn from './FavoriteBtn'; 

const Menu = () => {
  const { category = 'all' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [price, setPrice] = useState(searchParams.get('price') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToCart, getCartItemQuantity, showCartPopup, setShowCartPopup, getTotalItems } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, price, sort, search);
    setSearchParams({
      search: search || '',
      price: price,
      sort: sort,
    });
  }, [selectedCategory, price, sort, search, setSearchParams]);

  useEffect(() => {
    setSelectedCategory(category || 'all'); // Fallback to 'all' if category is undefined
  }, [category]);

  const fetchCategories = async () => {
    try {
      setError('');
      const response = await axios.get('http://localhost:5001/api/categories');
      console.log('Categories API Response:', response.data);
      const categoriesWithAll = [
        { id: 'all', name: 'All' },
        ...response.data.data,
      ];
      setCategories(categoriesWithAll);
    } catch (err) {
      console.error('Error fetching categories:', err.response?.data || err.message);
      setError('Failed to load categories. Please try again.');
      setCategories([{ id: 'all', name: 'All' }]);
    }
  };

  const fetchProducts = async (categoryParam, priceParam, sortParam, searchParam) => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetch Products Params:', { categoryParam, priceParam, sortParam, searchParam });
      const response = await axios.get('http://localhost:5001/api/products/menu', {
        params: {
          category: categoryParam === 'all' ? undefined : categoryParam,
          price: priceParam,
          sort: sortParam,
          search: searchParam,
        },
      });
      console.log('Menu API Response:', response.data);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message);
      setError(`Failed to load products: ${err.response?.data?.message || err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId || typeof categoryId !== 'string') {
      return 'Unknown';
    }
    const category = categories.find(
      (cat) => cat.id === categoryId || cat.name.toLowerCase() === categoryId.toLowerCase()
    );
    return category ? category.name : 'Unknown';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory('all');
    navigate(`/menu/all?search=${encodeURIComponent(search)}&price=${price}&sort=${sort}`);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSearch('');
    navigate(`/menu/${value}?price=${price}&sort=${sort}`);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleClearFilters = () => {
    setSearch('');
    setPrice('all');
    setSort('name');
    setSelectedCategory('all');
    navigate('/menu/all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <div className="flex items-center">
          <a href="/" className="hover:text-rose-600 transition-colors">
            Home
          </a>
        </div>
        <div className="flex items-center">
          <i className="ri-arrow-right-s-line mx-2"></i>
          <span className="text-rose-600">Menu</span>
        </div>
        {selectedCategory !== 'all' && (
          <div className="flex items-center">
            <i className="ri-arrow-right-s-line mx-2"></i>
            <span className="text-gray-800 capitalize">{getCategoryName(selectedCategory)}</span>
          </div>
        )}
      </nav>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-red-800 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <form className="flex gap-4 mb-4 items-center" onSubmit={handleSearchSubmit}>
          <div className="flex-1 relative">
            <input
              placeholder="Search for pastries, cakes, breads..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm pl-10"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            type="submit"
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors whitespace-nowrap disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
          {(search || selectedCategory !== 'all' || price !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-rose-600 hover:text-rose-800 text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">Category</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      className="mr-3 text-rose-500 focus:ring-rose-500"
                      type="radio"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={() => handleCategoryChange(cat.id)}
                      name="category"
                    />
                    <span className="text-sm capitalize">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">Price Range</h3>
              <div className="space-y-1">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under10', label: 'Under $10' },
                  { value: '10to20', label: '$10 - $20' },
                  { value: 'over20', label: 'Over $20' },
                ].map((range) => (
                  <label key={range.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      className="mr-3 text-rose-500 focus:ring-rose-500"
                      type="radio"
                      value={range.value}
                      checked={price === range.value}
                      onChange={() => handlePriceChange(range.value)}
                      name="price"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Sort By</h3>
              <select
                className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="name">Name A-Z</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-rose-100 p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="ri-search-line text-6xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {search ? `No results for "${search}"` : 'No products available in this category'}
              </p>
              {(search || selectedCategory !== 'all' || price !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {products.map((product) => {
                const isInCart = getCartItemQuantity(product.id) > 0;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-rose-50 hover:border-rose-200 h-full flex flex-col relative"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        src={product.img_url || '/images/placeholder-product.jpg'}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-rose-600 rounded-full"
                          style={{ fontFamily: 'Rosario, sans-serif' }}
                        >
                          {product.category || 'Category'}
                        </span>
                      </div>
                      <FavoriteBtn product={product} />
                    </div>
                    <div className="relative" style={{ marginTop: '-20px', zIndex: 10 }}>
                      {isInCart ? (
                        <QuantityControl productId={product.id} />
                      ) : (
                        <div className="flex justify-center">
                          <button
                            className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl px-4 py-2 text-sm"
                            onClick={() => addToCart(product)}
                            style={{ fontFamily: 'Rosario, sans-serif' }}
                          >
                            <i className="ri-shopping-cart-line mr-2"></i>
                            Add to Cart
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3
                        className="font-bold text-lg text-gray-800 mb-2 line-clamp-1"
                        style={{ fontFamily: 'Rosario, sans-serif' }}
                      >
                        {product.name}
                      </h3>
                      <div className="mb-4">
                        <span
                          className="text-2xl font-bold text-rose-500"
                          style={{ fontFamily: 'Rosario, sans-serif' }}
                        >
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <button
          onClick={() => setShowCartPopup(!showCartPopup)}
          className="fixed bottom-6 right-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg transition-colors z-50"
          style={{ fontFamily: 'Rosario, sans-serif' }}
        >
          <i className="ri-shopping-cart-line text-xl"></i>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Cart Popup */}
      <CartPopup />
    </div>
  );
};

// Wrap with CartProvider like in OurProducts.js
export default () => (
  <CartProvider>
    <Menu />
  </CartProvider>
);