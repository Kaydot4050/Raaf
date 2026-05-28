import { useEffect, useState } from 'react';
import { products as fallback } from '../data/products.js';
import { productsApi } from '../lib/api.js';

export function useProducts() {
  const [products, setProducts] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list()
      .then((r) => {
        if (r.products?.length) setProducts(r.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
