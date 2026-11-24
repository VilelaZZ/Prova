import { StyleSheet, View } from 'react-native';

import { stockLevel } from '@/constants/stock';
import { useStockColors } from '@/hooks/use-stock-colors';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

/** Barra do saldo atual com um marcador na posição do estoque mínimo. */
export function StockMeter({
  product,
  height = 8,
}: {
  product: Pick<Product, 'quantidade' | 'estoqueMinimo'>;
  height?: number;
}) {
  const theme = useTheme();
  const colors = useStockColors(stockLevel(product));

  // Escala: o maior entre o saldo e o dobro do mínimo, para o marcador nunca ficar colado na borda.
  const scale = Math.max(product.quantidade, product.estoqueMinimo * 2, 1);
  const fill = Math.min(product.quantidade / scale, 1) * 100;
  const marker = Math.min(product.estoqueMinimo / scale, 1) * 100;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Saldo ${product.quantidade}, estoque mínimo ${product.estoqueMinimo}`}
      accessibilityValue={{ min: 0, max: scale, now: product.quantidade }}
      style={[styles.track, { height, backgroundColor: theme.backgroundSelected }]}>
      <View style={{ width: `${fill}%`, height, backgroundColor: colors.rail }} />
      <View style={[styles.marker, { left: `${marker}%`, backgroundColor: theme.text }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 999, overflow: 'hidden', width: '100%' },
  marker: { position: 'absolute', top: 0, bottom: 0, width: 2, opacity: 0.55 },
});
