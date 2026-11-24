import { useCallback, useEffect, useState } from 'react';

import type { MovementType } from '@/constants/stock';
import { getErrorMessage } from '@/services/api';
import { MovementRejectedError } from '@/services/errors';
import { fetchProduct, registerMovement } from '@/services/products';
import type { Product } from '@/types/product';

export type MovementResult = { ok: true; message: string } | { ok: false; message: string };

/** Estado da tela de detalhes: carrega `GET /api/produtos/{id}` e registra entrada/saída via API. */
export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setError('Produto não informado.');
      setLoading(false);
      return;
    }
    try {
      setProduct(await fetchProduct(id));
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  /**
   * Só atualiza o saldo na tela depois que a API confirma; se a API rejeitar
   * (ex.: saída maior que o saldo), o saldo continua o mesmo e a mensagem volta para o formulário.
   */
  const move = useCallback(
    async (tipo: MovementType, quantidade: number): Promise<MovementResult> => {
      if (!product || moving) return { ok: false, message: 'Aguarde a operação anterior terminar.' };
      setMoving(true);
      try {
        const updated = await registerMovement(product.id, tipo, quantidade);
        setProduct(updated);
        const verb = tipo === 'ENTRADA' ? 'Entrada' : 'Saída';
        return {
          ok: true,
          message: `${verb} de ${quantidade} un. registrada. Novo saldo: ${updated.quantidade}.`,
        };
      } catch (e) {
        return {
          ok: false,
          message: e instanceof MovementRejectedError ? e.message : getErrorMessage(e),
        };
      } finally {
        setMoving(false);
      }
    },
    [product, moving],
  );

  return { product, loading, error, moving, retry, move };
}
