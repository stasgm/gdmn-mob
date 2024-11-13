import { DefaultTheme as PaperDefaultTheme, MD2LightTheme, MD2DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

import colors from '../styles/colors';

const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  ...MD2LightTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    ...MD2LightTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    placeholder: colors.placeholder,
  },
  roundness: 2,
  dark: false,
};

const themeDark = {
  ...PaperDefaultTheme,
  ...NavigationDarkTheme,
  ...MD2DarkTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDarkTheme.colors,
    ...MD2DarkTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    placeholder: colors.placeholder,
  },
  roundness: 2,
  dark: true,
};

export { theme, themeDark };
