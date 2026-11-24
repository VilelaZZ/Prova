import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { isLowStock } from '@/constants/stock';
import { Spacing } from '@/constants/theme';
import { useStockColors } from '@/hooks/use-stock-colors';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

function Stat({ value, label, color }: { value: number; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText style={[styles.statNumber, color ? { color } : null]}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

/** Painel do topo da lista: total de produtos, unidades em estoque e quantos estão com estoque baixo. */
export function StockSummary({ products }: { products: Product[] }) {
  const theme = useTheme();
  const low = useStockColors('out');
  if (products.length === 0) return null;

  const lowCount = products.filter(isLowStock).length;
  const units = products.reduce((sum, p) => sum + p.quantidade, 0);

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Stat value={products.length} label={products.length === 1 ? 'Produto' : 'Produtos'} />
      <Stat value={units} label="Unidades" />
      <Stat value={lowCount} label="Estoque baixo" color={lowCount > 0 ? low.text : undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  stat: { flex: 1, gap: Spacing.half },
  statNumber: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
});
