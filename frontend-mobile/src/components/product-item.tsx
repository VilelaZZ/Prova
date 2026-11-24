import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { StockBadge } from '@/components/stock-badge';
import { StockMeter } from '@/components/stock-meter';
import { ThemedText } from '@/components/themed-text';
import { STOCK_LEVEL_LABEL, stockLevel } from '@/constants/stock';
import { Spacing } from '@/constants/theme';
import { useStockColors } from '@/hooks/use-stock-colors';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

/** Linha da lista. Toque → navega para `/products/[id]` (src/app/products/[id].tsx). */
export function ProductItem({ product }: { product: Product }) {
  const theme = useTheme();
  const level = stockLevel(product);
  const colors = useStockColors(level);
  const alert = level !== 'ok';

  return (
    <Link href={{ pathname: '/products/[id]', params: { id: product.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${product.nome}. ${product.categoria}. Saldo ${product.quantidade}, mínimo ${product.estoqueMinimo}. ${STOCK_LEVEL_LABEL[level]}. Abrir detalhes`}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: pressed ? theme.backgroundSelected : theme.background,
            borderBottomColor: theme.border,
          },
        ]}>
        <View style={[styles.rail, { backgroundColor: colors.rail }]} />
        <View style={styles.body}>
          <View style={styles.top}>
            <View style={styles.titleBlock}>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {product.categoria}
              </ThemedText>
              <ThemedText numberOfLines={2} style={styles.title}>
                {product.nome}
              </ThemedText>
            </View>
            <View style={styles.qty}>
              <ThemedText style={[styles.qtyNumber, alert && { color: colors.text }]}>
                {product.quantidade}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                em estoque
              </ThemedText>
            </View>
          </View>

          <StockMeter product={product} />

          <View style={styles.bottom}>
            {alert ? <StockBadge product={product} /> : null}
            <ThemedText type="small" themeColor="textSecondary">
              Mínimo: {product.estoqueMinimo}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingRight: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rail: { width: 4, borderTopRightRadius: 2, borderBottomRightRadius: 2 },
  body: { flex: 1, gap: Spacing.two + 2 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  titleBlock: { flex: 1, gap: Spacing.half },
  title: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  qty: { alignItems: 'flex-end' },
  qtyNumber: { fontSize: 28, lineHeight: 32, fontWeight: '700' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
});
