import type { StockLevel } from '@/constants/stock';
import { StockColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useStockColors(level: StockLevel) {
  const scheme = useColorScheme();
  return StockColors[scheme === 'dark' ? 'dark' : 'light'][level];
}
