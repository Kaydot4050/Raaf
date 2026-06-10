import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { products as staticProducts } from '../data/products.js';
import { productsApi } from '../lib/api.js';
import { enrichProduct } from '../lib/productImages.js';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loaded = useRef(false);

  const refresh = useCallback(async () => {
    if (!loaded.current) setLoading(true);
    try {
      const r = await productsApi.list();
      setProducts((r.products || []).map((p) => enrichProduct(p)));
      setError(null);
      loaded.current = true;
    } catch (e) {
      if (staticProducts.length) {
        setProducts(staticProducts.map((p) => enrichProduct(p)));
        setError(null);
        loaded.current = true;
      } else {
        setError(e.message || 'Could not load products.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProductsContext.Provider value={{ products, loading, error, refresh }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
