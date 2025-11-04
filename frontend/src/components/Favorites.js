import React from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Navbar from './Navbar';
import FavoriteBtn from './FavoriteBtn';
import QuantityControl from './QuantityControl';

const Favorites = () => {
  const { addToCart, getCartItemQuantity, showCartPopup, setShowCartPopup, getTotalItems } = useCart();
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <a className="hover:text-pink-600 transition-colors" href="/">
              Home
            </a>
          </div>
          <div className="flex items-center">
            <i className="ri-arrow-right-s-line mx-2"></i>
            <span className="text-pink-600">Favorites</span>
          </div>
        </nav>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <div className="flex space-x-3">
            <button className="text-gray-600 hover:text-gray-800 font-bold">
              <i className="ri-share-line mr-2"></i>Share List
            </button>
            {favorites.length > 0 && (
              <button
                className="text-red-600 hover:text-red-800 font-bold"
                onClick={clearFavorites}
              >
                <i className="ri-delete-bin-line mr-2"></i>Clear All
              </button>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="ri-heart-line text-6xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 mb-4">Add products to your favorites to see them here.</p>
            <a
              href="/menu/all"
              className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => {
              const isInCart = getCartItemQuantity(product.id) > 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 h-full flex flex-col relative"
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
      </div>
    </div>
  );
};

export default Favorites;