import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart with session storage and price parsing
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart).map(item => ({
        ...item,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      })) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });
  
  const [showCartPopup, setShowCartPopup] = useState(false);

  // Save cart to session storage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart updated, total items:', getTotalItems());
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cart]);

  // Add item to cart with proper type checking
  const addToCart = useCallback((product) => {
    if (!product?.id) {
      console.error('Invalid product:', product);
      return;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, {
        ...product,
        price: parseFloat(product.price),
        quantity: 1
      }];
    });
    setShowCartPopup(true);
  }, []);

  // Update quantity with validation
  const updateQuantity = useCallback((id, newQuantity) => {
    if (!id || newQuantity < 0) {
      console.error('Invalid update parameters:', { id, newQuantity });
      return;
    }

    setCart(currentCart => {
      if (newQuantity === 0) {
        return currentCart.filter(item => item.id !== id);
      }
      return currentCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  // Remove item and handle popup state
  const removeFromCart = useCallback((id) => {
    if (!id) return;
    
    setCart(currentCart => {
      const newCart = currentCart.filter(item => item.id !== id);
      if (currentCart.length === 1) {
        setShowCartPopup(false);
      }
      return newCart;
    });
  }, []);

  // Memoized cart calculations
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + (item?.quantity || 0), 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    );
  }, [cart]);

  const getCartItemQuantity = useCallback((productId) => {
    if (!productId) return 0;
    const item = cart.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cart]);

  const value = {
    cart,
    showCartPopup,
    setShowCartPopup,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartItemQuantity,
    getCartTotal,
    getTotalItems,
    totalItems: getTotalItems() // Add direct access to total items
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook with error handling
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};