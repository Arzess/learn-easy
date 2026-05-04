import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  setDarkMode: () => {},
});

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [darkModeOverride, setDarkModeOverride] = useState<boolean | null>(null);

  const isDarkMode =
    darkModeOverride !== null ? darkModeOverride : systemScheme === 'dark';
  const theme: Theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setDarkMode: setDarkModeOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
