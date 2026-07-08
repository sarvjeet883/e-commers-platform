import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

const CART_KEY = "ecoglam_cart";

const ProductContextWrapper = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Cart survives page refresh (like Flipkart)
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + (product.quantity || 1) }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((el) => el.id !== id));
  };

  const updateQuantity = (id, type) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const newQty =
          type === "increment"
            ? product.quantity + 1
            : product.quantity - 1;

        return {
          ...product,
          quantity: Math.max(1, newQty), // Prevent less than 1
        };
      })
    );
  };

  const clearCart = () => setProducts([]);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, removeProduct, updateQuantity, clearCart }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useCart = () => useContext(ProductContext);

export default ProductContextWrapper;
