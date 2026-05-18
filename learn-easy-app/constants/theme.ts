import { Platform, StyleSheet } from 'react-native';

export const colors = StyleSheet.create({
  black: { color: '#000000' },
  blackBg: { backgroundColor: '#000000' },
  primary: { color: '#505050' },
  primaryBg: { backgroundColor: '#505050' },
  white: { color: 'white' },
  whiteBg: { backgroundColor: 'white' },
  interface: { color: '#1B1E20' },
  interfaceBg: { backgroundColor: '#1B1E20' },
  primary2: { color: '#B4B4B4' },
  primary2Bg: { backgroundColor: '#B4B4B4' },
  secondary: { color: '#E8E8E8' },
  secondaryBg: { backgroundColor: '#E8E8E8' },
  secondary2: { color: '#E5E5E5' },
  secondary2Bg: { backgroundColor: '#E5E5E5' },
  secondary2BgLight: { backgroundColor: '#F8F8F8' },
  interface2: { color: '#171717' },
  interface2Bg: { backgroundColor: '#171717' }
});

export const fonts = StyleSheet.create({
  josefin: { fontFamily: 'JosefinSans_400Regular' },
  josefinMedium: { fontFamily: 'JosefinSans_500Medium' },
  josefinSemi: { fontFamily: 'JosefinSans_600SemiBold' },
  josefinBold: { fontFamily: 'JosefinSans_700Bold' },
});

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#111111',
    background: '#f2f2f7',
    tint: tintColorLight,
    icon: '#6e6e73',
    tabIconDefault: '#8e8e93',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: colors.white.color,
    background: colors.interfaceBg.backgroundColor,
    tint: tintColorDark,
    icon: colors.white.color,
    tabIconDefault: colors.primary2.color,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'JosefinSans_400Regular',
    serif: 'JosefinSans_700Bold',
    rounded: 'JosefinSans_500Medium',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'JosefinSans_400Regular',
    bold: 'JosefinSans_700Bold',
    medium: 'JosefinSans_500Medium',
    semiBold: 'JosefinSans_600SemiBold',
    mono: 'monospace',
  },
})