import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id); // Debug log
        setLoading(true);
        const productRes = await axios.get(`http://localhost:5001/api/products/${id}`); 
        console.log("API Response:", productRes.data);
        
        setProduct(productRes.data.data);
      } catch (err) {
        console.log("Error details:", err.response?.data || err.message); // Debug log
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Create productImages array from all available images
  const productImages = useMemo(() => {
    if (!product) return [];
    
    const images = [];
    
    // Add main image first if it exists
    if (product.img_url) {
      images.push(product.img_url);
    }
    
    // Add thumbnail images if they exist
    if (product.thumbnails) {
        Object.values(product.thumbnails).forEach(thumbnailUrl => {
            if(thumbnailUrl) {
                images.push(thumbnailUrl);
            }
        });
    }
    
    return [...new Set(images)]; // Use Set to remove duplicate images if main image is also in thumbnails
  }, [product]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return newQuantity < 1 ? 1 : newQuantity > (product?.stock || 1) ? (product?.stock || 1) : newQuantity;
    });
  };

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log(`Added ${quantity} x ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    // Buy now functionality
    console.log(`Buy now: ${quantity} x ${product.name}`);
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg" style={{ fontFamily: "Rosario, sans-serif" }}>
              Loading product...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg" style={{ fontFamily: "Rosario, sans-serif" }}>
              {error || "Product not found"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <a className="hover:text-pink-600 transition-colors" href="/">
              Home
            </a>
          </div>
          <div className="flex items-center">
            <i className="ri-arrow-right-s-line mx-2"></i>
            <span className="text-pink-600 font-semibold">Product Detail</span>
          </div>

          <div className="flex items-center">
            <i className="ri-arrow-right-s-line mx-2"></i>
            <span className="text-pink-600 font-semibold">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
              alt={product?.name || 'Product'}
              className="w-full h-96 lg:h-[500px] object-cover object-top"
              src={productImages.length > 0 && productImages[selectedImage] ? productImages[selectedImage] : '/images/placeholder.jpg'}
            />
              <button className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-white shadow-lg">
                <i className="ri-heart-line text-gray-600 text-xl"></i>
              </button>
            </div>
            
            {/* Thumbnail Images - Only show if more than one image */}
            {productImages.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Product Images ({productImages.length})</p>
                <div className="flex space-x-3 space-y-1 overflow-x-auto pb-2 ">
                  {productImages.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === index 
                          ? "border-orange-500 shadow-md scale-105" 
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                      title={`View image ${index + 1}`}
                    >
                      <img 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover" 
                        src={image}
                        onError={(e) => {
                          e.target.src = '/placeholder-thumbnail.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Image {selectedImage + 1} of {productImages.length}
                  </p>
                </div>
              </div>
            )}

            {/* Show message if only one image */}
            {productImages.length === 1 && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Single product image</p>
              </div>
            )}

            {/* Show message if no images */}
            {productImages.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No product images available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 
                className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4" 
                style={{ fontFamily: "Rosario, sans-serif" }}
              >
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`${i < 4 ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'} text-lg`}
                    ></i>
                  ))}
                  <span 
                    className="ml-2 text-lg font-medium text-gray-700" 
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    4.8
                  </span>
                </div>
                <span 
                  className="text-gray-500" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  (146 reviews)
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span 
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Best Seller
                </span>
                <span 
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Premium
                </span>
                {productImages.length > 1 && (
                  <span 
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full" 
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    {productImages.length} Images
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-8">
                <span 
                  className="text-4xl font-bold text-orange-500" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  ${product.price}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 
                  className="text-xl font-bold text-gray-800 mb-3" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  Product Description
                </h3>
                <p 
                  className="text-gray-600 leading-relaxed mb-4" 
                  style={{ fontFamily: "Rosario, sans-serif" }}
                >
                  {product.description}
                </p>
                {product.stock > 0 && (
                  <p 
                    className="text-sm text-green-600 font-medium" 
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    In Stock: {product.stock} available
                  </p>
                )}
                {product.stock === 0 && (
                  <p 
                    className="text-sm text-red-600 font-medium" 
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span 
                    className="text-lg font-medium text-gray-700" 
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-subtract-line text-orange-600"></i>
                    </button>
                    <span 
                      className="text-xl font-bold text-gray-800 min-w-[40px] text-center" 
                      style={{ fontFamily: "Rosario, sans-serif" }}
                    >
                      {quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-add-line text-orange-600"></i>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md px-8 py-4 text-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    <i className="ri-shopping-bag-line mr-2"></i>
                    Buy Now
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="whitespace-nowrap cursor-pointer font-medium transition-all duration-200 rounded-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Rosario, sans-serif" }}
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;