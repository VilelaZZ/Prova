import type { Product } from '@/types/product';

/** Tipo de movimentação — valores IGUAIS aos da API (enunciado): ENTRADA ou SAIDA. */
export type MovementType = 'ENTRADA' | 'SAIDA';

export const MOVEMENT_ORDER: MovementType[] = ['ENTRADA', 'SAIDA'];

export const MOVEMENT_LABEL: Record<MovementType, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
};

/** Nível do estoque: `out` = zerado, `low` = quantidade <= estoque mínimo (regra do enunciado), `ok` = normal. */
export type StockLevel = 'ok' | 'low' | 'out';

export function stockLevel(product: Pick<Product, 'quantidade' | 'estoqueMinimo'>): StockLevel {
  if (product.quantidade <= 0) return 'out';
  if (product.quantidade <= product.estoqueMinimo) return 'low';
  return 'ok';
}

/** Estoque baixo = quantidade menor ou igual ao estoque mínimo (inclui zerado). */
export const isLowStock = (product: Pick<Product, 'quantidade' | 'estoqueMinimo'>) =>
  stockLevel(product) !== 'ok';

export const STOCK_LEVEL_LABEL: Record<StockLevel, string> = {
  ok: 'Estoque normal',
  low: 'Estoque baixo',
  out: 'Sem estoque',
};
