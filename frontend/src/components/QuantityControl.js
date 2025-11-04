import React from 'react';
import { useCart } from '../context/CartContext';

const QuantityControl = ({ productId }) => {
  const { getCartItemQuantity, updateQuantity } = useCart();
  const quantity = getCartItemQuantity(productId);

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1">
        <div className="flex items-center space-x-3">
          <button 
            className="w-8 h-8 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            onClick={() => updateQuantity(productId, quantity - 1)}
          >
            <i className="ri-subtract-line text-sm"></i>
          </button>
          <span 
            className="text-lg font-bold text-gray-800 min-w-[24px] text-center" 
            style={{ fontFamily: 'Rosario, sans-serif' }}
          >
            {quantity}
          </span>
          <button 
            className="w-8 h-8 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            onClick={() => updateQuantity(productId, quantity + 1)}
          >
            <i className="ri-add-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityControl;