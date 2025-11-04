import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityControl from './QuantityControl';

const CartPopup = () => {
  const navigate = useNavigate();
  const { cart, showCartPopup, setShowCartPopup, removeFromCart, getTotalItems, getCartTotal } = useCart();

  const handleConfirmOrder = () => {
    setShowCartPopup(false); // Close the cart popup
    navigate('/checkout'); // Navigate to checkout page
  };

  if (!showCartPopup) return null;

  return (
    <div className="fixed right-4 top-4 w-80 bg-white rounded-lg shadow-2xl border z-50 max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-rose-600" style={{ fontFamily: 'Rosario, sans-serif' }}>
          Your Cart ({getTotalItems()})
        </h3>
        <button
          onClick={() => setShowCartPopup(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="p-6 text-center text-gray-500" style={{ fontFamily: 'Rosario, sans-serif' }}>
            Your cart is empty
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="p-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 flex-1" style={{ fontFamily: 'Rosario, sans-serif' }}>
                  {item.name}
                </h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Rosario, sans-serif' }}>
                  <span className="text-red-500 font-medium">{item.quantity}x</span>
                  <span className="text-gray-400 ml-2">@${item.price.toFixed(2)}</span>
                  <span className="font-medium ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-3">
                <QuantityControl productId={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium" style={{ fontFamily: 'Rosario, sans-serif' }}>
              Order Total
            </span>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Rosario, sans-serif' }}>
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-full transition-colors"
            style={{ fontFamily: 'Rosario, sans-serif' }}
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPopup;