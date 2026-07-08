import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const WISHLIST_KEY = "ecoglam_wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((p) => p.id !== id));

  return (
    <WishlistContext.Provider
      value={{ wishlist, isInWishlist, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
