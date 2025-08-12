import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeContextValue {
  colorScheme: ColorSchemeName;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');

  const toggleScheme = () => setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ colorScheme, toggleScheme }), [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};