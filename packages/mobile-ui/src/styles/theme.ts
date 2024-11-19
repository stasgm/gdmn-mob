import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

import colors from './colors';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    placeholder: colors.placeholder,
  },
};

const themeDark = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.blueLight,
    accent: colors.accent,
    text: colors.backgroundLight,
    placeholder: colors.placeholder,
    inversePrimary: colors.blueLight,
  },
};

export { theme, themeDark };
