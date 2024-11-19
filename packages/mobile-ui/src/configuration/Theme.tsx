import { MD2LightTheme, MD2DarkTheme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

import colors from '../styles/colors';

const theme = {
  ...MD3LightTheme,
  ...NavigationDefaultTheme,
  ...MD2LightTheme,
  colors: {
    ...MD3LightTheme.colors,
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
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  ...MD2DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    ...MD2DarkTheme.colors,
    primary: colors.blueLight,
    accent: colors.accent,
    text: colors.backgroundLight,
    placeholder: colors.placeholder,
    inversePrimary: colors.blueLight,
  },
  roundness: 2,
  dark: true,
};

export { theme, themeDark };
