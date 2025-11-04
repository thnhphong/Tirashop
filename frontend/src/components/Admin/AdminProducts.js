import React, {useState} from "react";
import { Link } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import ProductList from "./ProductList";

const AdminProducts = () => {
  /* state for modal */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-white p-1 rounded-full shadow-lg">
        <Link
          to="/admin"
          className="flex-1 text-gray-600 hover:text-pink-600 py-2 px-4 text-center font-medium whitespace-nowrap"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 px-4 rounded-full text-center font-medium whitespace-nowrap"
        >
          Products
        </Link>
        <Link
          to="/admin/orders"
          className="flex-1 text-gray-600 hover:text-pink-600 py-2 px-4 text-center font-medium whitespace-nowrap"
        >
          Orders
        </Link>
        <Link
          to="/admin/customers"
          className="flex-1 text-gray-600 hover:text-pink-600 py-2 px-4 text-center font-medium whitespace-nowrap"
        >
          Customers
        </Link>
        <Link
          to="/admin/marketing"
          className="flex-1 text-gray-600 hover:text-pink-600 py-2 px-4 text-center font-medium whitespace-nowrap"
        >
          Marketing
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage your pastry inventory and catalog</p>
        </div>
        <button 
         onClick={() => setIsModalOpen(true)}
         className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all whitespace-nowrap">
          <i className="ri-add-line mr-2"></i>Add Product
        </button>
       {/* modal */}
      </div>
       {isModalOpen && (
        <AddProductModal onClose={closeModal} />
      )}
     


      {/* Empty State */}
      <ProductList />
      
    </div>
  );
};

export default AdminProducts;
