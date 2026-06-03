import { useEffect, useState } from 'react';
import { products as fallback } from '../data/products.js';
import { productsApi } from '../lib/api.js';
import { enrichProduct } from '../lib/productImages.js';

const enrichedFallback = fallback.map(enrichProduct);

export function useProducts() {
  const [products, setProducts] = useState(enrichedFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .list()
      .then((r) => {
        if (r.products?.length) setProducts(r.products.map(enrichProduct));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
