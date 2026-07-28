import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, notes = '') => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id && item.notes === notes);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.notes === notes) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, notes, cartItemId: Date.now() + Math.random().toString(36).substring(2, 9) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => (item.cartItemId || item.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if ((item.cartItemId || item.id) === cartItemId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
