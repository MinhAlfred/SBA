import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      calculateTotalItems(parsedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    calculateTotalItems(cartItems);
    
    // Dispatch storage event for other tabs to sync
    window.dispatchEvent(new Event('storage'));
  }, [cartItems]);

  const calculateTotalItems = (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsCount = items.length;
    setItems(itemsCount);
    setTotalItems(total);
  };

  const addToCart = (orchid, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === orchid.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { ...orchid, quantity }];
      }
    });
  };

  const removeFromCart = (orchidId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== orchidId));
  };

  const updateQuantity = (orchidId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(orchidId);
      return;
    }
    
    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.id === orchidId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};