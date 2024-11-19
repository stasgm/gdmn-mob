import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, useTheme } from '@react-navigation/native';

import { theme as defaultTheme, themeDark as darkTheme, Provider as UIProvider } from '@lib/mobile-ui';

import Notification from './src/components/Notification';
import store from './src/store';
import DrawerNavigator from './src/components/DrawerNavigator';

// const newTheme: typeof defaultTheme = {
//   ...defaultTheme,
//   colors: {
//     ...defaultTheme.colors,
//     primary: '#3e92cc',
//   },
// };

export default () => {
  const { dark } = useTheme();
  return (
    <Provider store={store}>
      <UIProvider theme={dark ? darkTheme : defaultTheme}>
        <NavigationContainer>
          <DrawerNavigator />
          <Notification />
        </NavigationContainer>
      </UIProvider>
    </Provider>
  );
};
