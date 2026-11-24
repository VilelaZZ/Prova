import { useCallback, useState } from 'react';

import { getErrorMessage } from '@/services/api';
import { fetchProducts } from '@/services/products';
import type { Product } from '@/types/product';

/** Estado da listagem: carrega `GET /api/produtos` e expõe recarregar / puxar para atualizar. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // só na primeira carga
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setProducts(await fetchProducts());
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const retry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return { products, loading, refreshing, error, reload: load, refresh, retry };
}
