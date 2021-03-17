import { DefaultTheme } from 'react-native-paper';

// import AppColor from '../primitives/AppColor'

/* const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: AppColor.primary,
  },
  roundness: 2,
}
 */

import colors from '../styles/colors';

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

export default theme;
