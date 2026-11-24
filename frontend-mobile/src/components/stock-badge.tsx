import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { STOCK_LEVEL_LABEL, stockLevel } from '@/constants/stock';
import { Spacing } from '@/constants/theme';
import { useStockColors } from '@/hooks/use-stock-colors';
import type { Product } from '@/types/product';

/** Selo do nível de estoque: "Estoque normal", "Estoque baixo" (quantidade <= mínimo) ou "Sem estoque". */
export function StockBadge({ product }: { product: Pick<Product, 'quantidade' | 'estoqueMinimo'> }) {
  const level = stockLevel(product);
  const colors = useStockColors(level);

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, { backgroundColor: colors.rail }]} />
      <ThemedText style={[styles.label, { color: colors.text }]}>{STOCK_LEVEL_LABEL[level]}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
});
