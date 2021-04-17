import { createMuiTheme, colors, ThemeOptions } from '@material-ui/core';

import shadows from './shadows';
import typography from './typography';

/* const theme2 = createMuiTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: colors.common.white,
    },
    primary: {
      contrastText: '#ffffff',
      main: '#5664d2',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
  },
  shadows,
  typography,
}); */

const theme: ThemeOptions = createMuiTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: colors.common.white,
    },
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2d3ca0',
    },
  },
  shadows,
  typography,
});

export default theme;
