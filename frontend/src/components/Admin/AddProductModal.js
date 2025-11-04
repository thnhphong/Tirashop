import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [ categories, setCategories ] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    img_url: null,
    thumbnail_img_1: null,
    thumbnail_img_2: null,
    thumbnail_img_3: null,
    thumbnail_img_4: null,
  });
  const [thumbnails, setThumbnails] = useState([null, null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
}, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setForm({ ...form, img_url: e.target.files[0] });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("categoryId", form.category);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("description", form.description);
  
  if (form.img_url) {
    formData.append("img_url", form.img_url);
  }
  thumbnails.forEach((thumb, index) => {
    if (thumb) {
      formData.append(`thumbnail_img_${index + 1}`, thumb);
    }
  });
  try {
    console.log('Sending form data:', Object.fromEntries(formData));
    const res = await axios.post("http://localhost:5001/api/products/create", formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      }
    });
    
    if (res.data.success) {
      if (onProductAdded) onProductAdded(res.data.product);
      if (onClose) onClose();
    }
  } catch (err) {
    console.error('Error details:', err.response?.data || err.message);
    alert(`Failed to add product: ${err.response?.data?.message || err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleThumbnailChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newThumbnails = [...thumbnails];
      newThumbnails[index] = file;
      setThumbnails(newThumbnails);
      
      // Update form with thumbnail data
      setForm(prev => ({
        ...prev,
        [`thumbnail_img_${index + 1}`]: file
      }));
    }
  };

  const removeThumbnail = (index) => {
    const newThumbnails = [...thumbnails];
    newThumbnails[index] = null;
    setThumbnails(newThumbnails);
    
    // Remove from form
    setForm(prev => {
      const newForm = { ...prev };
      delete newForm[`thumbnail_img_${index + 1}`];
      return newForm;
    });
  };

  const getNextEmptyThumbnailIndex = () => {
    return thumbnails.findIndex(thumb => thumb === null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <button
          type="button"
          className="text-gray-500 w-10 h-10 hover:text-gray-700 hover:border hover:rounded-full hover:bg-gray-200"          
          onClick={onClose}
          disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              <option value="">Select category</option>
              {categories && categories.map((cat) => (
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Stock
            </label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="0"
              type="number"
              required
              disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </p>
              {form.img_url && (
                <p className="mt-2 text-sm text-pink-600">
                  Selected: {form.img_url.name}
                </p>
              )}
            </label>
          </div>
        </div>

           {/* Thumbnail Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Thumbnails)
        </label>
        <p className="text-xs text-gray-500 mb-4">Add up to 4 additional product images</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {thumbnails.map((thumbnail, index) => (
            <div key={index} className="relative">
              {thumbnail ? (
                // Show uploaded thumbnail
                <div className="relative group">
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeThumbnail(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {thumbnail.name}
                    </p>
                  </div>
                </div>
              ) : (
                // Show upload area
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300 transition-colors h-32 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleThumbnailChange(index, e)}
                    className="hidden"
                    id={`thumbnail-${index}`}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={`thumbnail-${index}`} className="cursor-pointer text-center">
                    <i className="ri-image-add-line text-2xl text-gray-400 mb-1"></i>
                    <p className="text-xs text-gray-500">Upload Image {index + 1}</p>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick upload for next available slot */}
        {getNextEmptyThumbnailIndex() !== -1 && !isSubmitting && (
          <div className="mt-4">
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => handleThumbnailChange(getNextEmptyThumbnailIndex(), e)}
              className="hidden"
              id="quick-thumbnail-upload"
            />
            <label 
              htmlFor="quick-thumbnail-upload" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Add Another Image
            </label>
          </div>
        )}
      </div>

      {/* Image Preview Summary */}
      {(form.img_url || thumbnails.some(thumb => thumb !== null)) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Image Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {form.img_url && (
              <div className="flex items-center">
                <i className="ri-image-line mr-2 text-green-600"></i>
                Main image: {form.img_url.name}
              </div>
            )}
            {thumbnails.filter(thumb => thumb !== null).map((thumb, index) => {
              const actualIndex = thumbnails.findIndex(t => t === thumb);
              return (
                <div key={actualIndex} className="flex items-center">
                  <i className="ri-image-2-line mr-2 text-blue-600"></i>
                  Thumbnail {actualIndex + 1}: {thumb.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            disabled={isSubmitting}
          >
             {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Adding Product...
                </div>
              ) : (
                'Add Product'
              )}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddProductModal;
