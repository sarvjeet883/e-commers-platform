import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getProducts } from "../api";
import localProducts from "../data/myProducts.json";

// Serves the product catalogue from the backend (MongoDB).
// Falls back to the bundled JSON if the API is unreachable,
// so the storefront still works offline / before seeding.
const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
  const [catalog, setCatalog] = useState(localProducts);

  const refreshCatalog = useCallback(async () => {
    try {
      const data = await getProducts();
      if (data.products?.length) setCatalog(data.products);
    } catch {
      // keep the local JSON fallback
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  return (
    <CatalogContext.Provider value={{ catalog, refreshCatalog }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => useContext(CatalogContext);
