import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-white p-1 rounded-full shadow-lg">
        <Link
          to="/admin"
          className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 px-4 rounded-full text-center font-medium whitespace-nowrap"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="flex-1 text-gray-600 hover:text-pink-600 py-2 px-4 text-center font-medium whitespace-nowrap"
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Sales", value: "$8,750", color: "from-green-400 to-green-500", icon: "ri-money-dollar-circle-line" },
          { label: "Orders", value: "245", color: "from-blue-400 to-blue-500", icon: "ri-shopping-bag-line" },
          { label: "Customers", value: "189", color: "from-purple-400 to-purple-500", icon: "ri-user-line" },
          { label: "Avg Order", value: "$35.71", color: "from-pink-400 to-pink-500", icon: "ri-calculator-line" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
