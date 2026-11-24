import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductItem } from '@/components/product-item';
import { EmptyState, ErrorState, LoadingState } from '@/components/state-views';
import { StockSummary } from '@/components/stock-summary';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { isLowStock } from '@/constants/stock';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useProducts } from '@/hooks/use-products';
import { useTheme } from '@/hooks/use-theme';

/** 'ALL' = todos, 'LOW' = estoque baixo, qualquer outro valor = nome da categoria. */
type Filter = string;

export default function ProductListScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { products, loading, refreshing, error, reload, refresh, retry } = useProducts();
  const [filter, setFilter] = useState<Filter>('ALL');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.categoria))).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [products],
  );

  if (loading) return <LoadingState label="Carregando produtos…" />;
  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  const matches = (p: (typeof products)[number], f: Filter) =>
    f === 'ALL' ? true : f === 'LOW' ? isLowStock(p) : p.categoria === f;

  const filters: { key: Filter; label: string }[] = [
    { key: 'ALL', label: 'Todos' },
    { key: 'LOW', label: 'Estoque baixo' },
    ...categories.map((c) => ({ key: c, label: c })),
  ];
  const visible = products.filter((p) => matches(p, filter));
  const countOf = (f: Filter) => products.filter((p) => matches(p, f)).length;

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        style={styles.list}
        data={visible}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => <ProductItem product={item} />}
        refreshing={refreshing}
        onRefresh={refresh}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <StockSummary products={products} />

            {error ? (
              <Pressable onPress={retry} accessibilityRole="button" style={styles.banner}>
                <ThemedText type="small" style={{ color: theme.danger }}>
                  Não foi possível atualizar a lista. Toque para tentar de novo.
                </ThemedText>
              </Pressable>
            ) : null}

            <FlatList
              horizontal
              data={filters}
              keyExtractor={(f) => f.key}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              renderItem={({ item }) => {
                const selected = item.key === filter;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setFilter(item.key)}
                    style={[
                      styles.chip,
                      { backgroundColor: selected ? theme.primary : theme.backgroundElement },
                    ]}>
                    <ThemedText
                      type="small"
                      style={{ color: selected ? '#ffffff' : theme.text, fontWeight: '600' }}>
                      {item.label} {countOf(item.key)}
                    </ThemedText>
                  </Pressable>
                );
              }}
            />
          </View>
        }
        ListEmptyComponent={
          products.length === 0 ? (
            <EmptyState
              title="Nenhum produto por aqui"
              hint="Os produtos cadastrados no Angular (ou direto na API) aparecem aqui. Puxe a lista para baixo para atualizar."
            />
          ) : (
            <EmptyState
              title="Nenhum produto neste filtro"
              hint={filter === 'LOW' ? 'Nenhum produto com estoque baixo agora.' : 'Escolha outro filtro acima.'}
            />
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { flexGrow: 1 },
  header: { gap: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two },
  banner: { paddingHorizontal: Spacing.three },
  filters: { gap: Spacing.two, paddingHorizontal: Spacing.three },
  chip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
