import { DefaultTheme as PaperDefaultTheme, MD2LightTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

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

export default theme;
