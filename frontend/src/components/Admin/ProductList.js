import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProductModal from "./EditProductModal";
import { Link } from "react-router-dom";

const ProductList = () => {
  useEffect(() => {
    document.title = "Admin Products";
  }, []);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/categories");
        setCategories(res.data.data || []); // Ensure it's an array
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const json = await res.json();
        console.log("Products response:", json); // Debug the response
        if(json.success){
          const products = json.data || [];
          const total = products.length;
          const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
          const outOfStock = products.filter(p => p.stock === 0).length;
          setStats({ total, lowStock, outOfStock });
          setProducts(products);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    setStats({ total, lowStock, outOfStock });
  }, [products]);

  const handleImageError = (e, product) => {
    console.error("Image failed to load:", {
      src: e.target.src,
      productId: product.id,
      imgUrl: product.img_url,
    });
    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
    e.target.onerror = null;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (product.category?.name &&
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (e, product) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    const productName = product.name || product.title || "this product";
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      axios
        .delete(`http://localhost:5001/api/products/delete/${product.id}`)
        .then((res) => {
          if (res.data.success) {
            setProducts(products.filter((p) => p.id !== product.id));
          } else {
            alert(`Failed to delete product: ${res.data.message}`);
          }
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
          alert("Failed to delete product");
        });
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <select
            className="px-6 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 pr-8"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Sales
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.img_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover object-top rounded-lg"
                        onError={(e) => handleImageError(e, product)}
                      />
                      { /* fix width*/}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-3">{product.description}
                        </p>
                       
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-md text-gray-600 text-semibold">
                      {product.category?.name || ""}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">${product.price}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-medium ${
                        product.stock > 10
                          ? "text-green-600"
                          : product.stock > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {product.sales || 0}
                    </span>
                  </td>
                  <td className="py-4 px-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 10
                        ? "Active"
                        : product.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <button
                      onClick={() => setSelectedProduct(product)}
                       className="text-blue-500 hover:text-blue-600 p-1 text-xl">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="text-green-500 hover:text-green-600 p-1 text-xl">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button
                        onClick={(e) => handleDeleteProduct(e, product)}
                        className="text-red-500 hover:text-red-600 p-1 text-xl"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
      {/* Add the modal here */}
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProductUpdated={(updatedProduct) => {
            setProducts(
              products.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
              )
            );
            setSelectedProduct(null);
          }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
            <i className="ri-shopping-bag-line text-white text-xl"></i>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <i className="ri-alert-line text-white text-xl"></i>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <i className="ri-close-circle-line text-white text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductList;