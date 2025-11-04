import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();

    // Pre-fill form with product data when modal opens
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category_id || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        image: null, // Image will be updated only if a new file is selected
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("categoryId", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    if (form.image) {
      formData.append("img_url", form.image); // Only append new image if selected
    }

    try {
      const res = await axios.put(
        `http://localhost:5001/api/products/edit/${product.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response:", res.data);
      if (onProductUpdated) onProductUpdated(res.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      alert(
        `Failed to update product: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            type="button"
            className="text-gray-500 w-10 h-10 hover:text-gray-700 hover:border hover:rounded-full hover:bg-gray-200" 
            onClick={onClose}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter product name"
                type="text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 pr-8"
                required
              >
                <option value="">Select category</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0.00"
                type="number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0"
                type="number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Enter product description"
              required
            />
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Product Image
  </label>
  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer">
    <input
      type="file"
      accept="image/png,image/jpeg"
      onChange={handleFileChange}
      className="hidden"
      id="product-image"
    />
    <label htmlFor="product-image" className="cursor-pointer">
      <div className="flex flex-col items-center">
        {form.image && (
          <img
            src={URL.createObjectURL(form.image)}
            alt="Selected Preview"
            className="w-32 h-32 object-cover rounded-lg mb-2"
          />
        )}
        {!form.image && product?.img_url && (
          <img
            src={product.img_url}
            alt="Current Image"
            className="w-32 h-32 object-cover rounded-lg mb-2"
          />
        )}
        {!form.image && product?.img_url && (
          <p className="mt-2 text-sm text-gray-600">
            Current: {product.img_url}
          </p>
        )}
        <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
        <p className="text-gray-600">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
        {form.image && (
          <p className="mt-2 text-sm text-pink-600">
            Selected: {form.image.name}
          </p>
        )}
        
      </div>
    </label>
  </div>
</div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;