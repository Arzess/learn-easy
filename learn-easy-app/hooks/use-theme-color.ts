import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Theme = 'light' | 'dark';

function resolveTheme(scheme: string | null | undefined): Theme {
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = resolveTheme(useColorScheme());
  const colorFromProps = props[theme];
  return colorFromProps ?? Colors[theme][colorName];
}
