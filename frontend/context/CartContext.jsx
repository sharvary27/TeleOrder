import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (newItem) => {
  setCart((prev) => {
    const existingIndex = prev.findIndex(
      (i) =>
        i.item.toLowerCase() === newItem.item.toLowerCase() &&
        (i.variant || "").toLowerCase() === (newItem.variant || "").toLowerCase() &&
        (i.size || "").toLowerCase() === (newItem.size || "").toLowerCase()
    );

    if (existingIndex !== -1) {
      return prev.map((i, index) =>
        index === existingIndex
          ? {
              ...i,
              quantity: i.quantity + newItem.quantity,
              totalPrice: (i.quantity + newItem.quantity) * i.price,
            }
          : i
      );
    }

    return [...prev, newItem];
  });
};

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const removeByName = (name) => {
    setCart((prev) =>
      prev.filter((i) => i.item.toLowerCase() !== name.toLowerCase())
    );
  };

  const updateByName = (name, updates) => {
  setCart((prev) =>
    prev.map((i) =>
      i.item.toLowerCase() === name.toLowerCase()
        ? {
            ...i,
            variant: updates.variant || i.variant,
            size: updates.size || i.size,
            quantity: updates.quantity || i.quantity,
            totalPrice: (updates.quantity || i.quantity) * i.price,
          }
        : i
    )
  );
};

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.price,
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeByName,
        updateQuantity,
        clearCart,
        updateByName,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);