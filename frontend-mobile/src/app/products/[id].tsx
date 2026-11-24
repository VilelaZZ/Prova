import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { MovementForm } from '@/components/movement-form';
import { ErrorState, LoadingState } from '@/components/state-views';
import { StockBadge } from '@/components/stock-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STOCK_LEVEL_LABEL, stockLevel } from '@/constants/stock';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useProduct } from '@/hooks/use-product';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

function DetailRow({ label, value, last = false }: { label: string; value: string | number; last?: boolean }) {
  const theme = useTheme();

  return (
    <View style={[styles.tableRow, { borderBottomColor: theme.border }, last && styles.lastRow]}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText style={styles.value}>{String(value)}</ThemedText>
    </View>
  );
}

/** Exibe somente os dados essenciais do produto em formato de tabela. */
function ProductDetailsTable({ product }: { product: Product }) {
  const level = stockLevel(product);

  return (
    <View style={styles.table}>
      <DetailRow label="ID" value={product.id} />
      <DetailRow label="Categoria" value={product.categoria} />
      <DetailRow label="Descrição" value={product.descricao || 'Não informada'} />
      <DetailRow label="Quantidade disponível" value={`${product.quantidade} unidades`} />
      <DetailRow label="Estoque mínimo" value={`${product.estoqueMinimo} unidades`} />
      <DetailRow label="Situação" value={STOCK_LEVEL_LABEL[level]} last />
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { product, loading, error, moving, retry, move } = useProduct(id);

  const backToList = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (loading) return <LoadingState label="Carregando produto…" />;

  if (error || !product) {
    return (
      <ErrorState message={error ?? 'Produto não encontrado.'} onRetry={retry}>
        <ActionButton label="Voltar aos produtos" variant="secondary" onPress={backToList} />
      </ErrorState>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.six }]}>
        <View style={styles.titleBlock}>
          <ThemedText style={styles.title} accessibilityRole="header">
            {product.nome}
          </ThemedText>
          <StockBadge product={product} />
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold">Dados do produto</ThemedText>
          <ProductDetailsTable product={product} />
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold">Registrar movimentação</ThemedText>
          <MovementForm onSubmit={move} loading={moving} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { padding: Spacing.three, gap: Spacing.four },
  titleBlock: { gap: Spacing.two },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  section: { gap: Spacing.two },
  table: { borderWidth: StyleSheet.hairlineWidth, borderRadius: Spacing.two, overflow: 'hidden' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: { borderBottomWidth: 0 },
  label: { width: '42%' },
  value: { flex: 1, fontWeight: '600' },
});
