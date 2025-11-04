import React, { useState, useEffect } from "react";
import axios from "axios";
import { CartProvider, useCart } from "../../context/CartContext";
import QuantityControl from "../QuantityControl";
import CartPopup from "../CartPopup";

const OurProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart, getCartItemQuantity, showCartPopup, setShowCartPopup, getTotalItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5001/api/products"),
          axios.get("http://localhost:5001/api/categories")
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        setError("Failed to fetch products");
        console.log('Error fetching data: ', err);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => getCategoryName(product.category_id) === selectedCategory);

  if (error) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg" style={{ fontFamily: "Rosario, sans-serif" }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="text-center mb-12">
        <h2
          className="text-3xl font-bold text-center text-rose-600 mb-2 mt-4"
          style={{ fontFamily: "Rosario, sans-serif" }}
        >
          Our Products
        </h2>
        <p
          className="text-xl text-center text-orange-600 max-w-2xl mx-auto font-semibold"
          style={{ fontFamily: "Rosario, sans-serif" }}
        >
          Discover our handcrafted selection of pastries, cakes, and breads made fresh daily with the finest ingredients.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto px-4">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${selectedCategory === "All"
            ? "bg-rose-500 text-white shadow-md"
            : "bg-white text-gray-700 border border-rose-200 hover:border-rose-300 hover:bg-rose-50"
            }`}
          style={{ fontFamily: "Rosario, sans-serif" }}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${selectedCategory === category.name
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white text-gray-700 border border-rose-200 hover:border-rose-300 hover:bg-rose-50"
              }`}
            style={{ fontFamily: "Rosario, sans-serif" }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredProducts.map((product) => {
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
                  src={product.img_url}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-rose-600 rounded-full"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    {getCategoryName(product.category_id)}
                  </span>
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-white">
                  <i className="ri-heart-line text-gray-600 text-sm"></i>
                </button>
              </div>
              <div className="relative" style={{ marginTop: "-20px", zIndex: 10 }}>
                {isInCart ? (
                  <QuantityControl productId={product.id} />
                ) : (
                  <div className="flex justify-center">
                    <button
                      className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl px-4 py-2 text-sm"
                      onClick={() => addToCart(product)}
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      <i className="ri-shopping-cart-line mr-2"></i>
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                  ))}
                  <span
                    className="ml-2 text-sm text-gray-500"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    (5.0)
                  </span>
                </div>
                <h3
                  className="font-bold text-lg text-gray-800 mb-2 line-clamp-1"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  {product.description}
                </p>
                <button
                  onClick={() => window.location.href = `/product/${product.id}`}
                  className="text-rose-500 hover:text-rose-600 text-sm font-medium mb-4 text-left cursor-pointer transition-colors"
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Read more →
                </button>
                <div className="mb-4">
                  <span
                    className="text-2xl font-bold text-rose-500"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    ${product.price}
                  </span>
                </div>
                {product.stock < 5 && product.stock > 0 && (
                  <div className="text-xs text-orange-500 font-medium" style={{ fontFamily: "Rosario, sans-serif" }}>
                    Only {product.stock} left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="text-xs text-red-500 font-medium" style={{ fontFamily: "Rosario, sans-serif" }}>
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && !error && (
        <div className="text-center py-12">
          <p
            className="text-gray-500 text-lg"
            style={{ fontFamily: "Rosario, sans-serif" }}
          >
            No products found in this category.
          </p>
        </div>
      )}

      {products.length === 0 && !error && (
        <div className="text-center py-12">
          <p
            className="text-gray-500 text-lg"
            style={{ fontFamily: "Rosario, sans-serif" }}
          >
            Loading products...
          </p>
        </div>
      )}

      {getTotalItems() > 0 && (
        <button
          onClick={() => setShowCartPopup(!showCartPopup)}
          className="fixed bottom-6 right-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg transition-colors"
          style={{ fontFamily: "Rosario, sans-serif" }}
        >
          <i className="ri-shopping-cart-line text-xl"></i>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {getTotalItems()}
            </span>
          )}
        </button>
      )}
      <CartPopup />
    </section>
  );
};

const OurProductsWithProvider = () => (
  <CartProvider>
    <OurProducts />
  </CartProvider>
);

export default OurProductsWithProvider;