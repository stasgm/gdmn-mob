import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

import colors from '../styles/colors';

const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    placeholder: colors.placeholder,
  },
  roundness: 2,
  dark: false,
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

// const theme = {
//   ...DefaultTheme,
//   roundness: 2,
//   dark: false,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: colors.primary,
//     accent: colors.accent,
//     text: colors.text,
//     placeholder: colors.placeholder,
//   },
// };

export default theme;
