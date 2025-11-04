import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // Set COD as default
  const [cardType, setCardType] = useState('credit');
  const [noteLength, setNoteLength] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Calculate totals from cart
  const subtotal = getCartTotal();
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isAuthenticated() && user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'note') {
      setNoteLength(value.length);
    }

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if cart is empty
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }

    console.log('Order submitted:', {
      ...formData,
      paymentMethod,
      cardType,
      cartItems: cart,
      total: total
    });
    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="hover:text-pink-600 transition-colors"
          >
            Home
          </button>
        </div>
        <div className="flex items-center">
          <span className="mx-2">›</span>
          <button
            onClick={() => window.history.back()}
            className="hover:text-pink-600 transition-colors"
          >
            Cart
          </button>
        </div>
        <div className="flex items-center">
          <span className="mx-2">›</span>
          <span className="text-pink-600">Checkout</span>
        </div>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {cart.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">
              <i className="ri-shopping-cart-line text-xl"></i>
            </div>
            <div>
              <h3 className="text-yellow-800 font-medium">Your cart is empty</h3>
              <p className="text-yellow-700 text-sm">Please add items to your cart before proceeding to checkout.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className={`w-full py-4 px-6 rounded-lg font-bold transition-colors whitespace-nowrap ${cart.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
            >
              {cart.length === 0 ? 'Cart is Empty' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-800 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}