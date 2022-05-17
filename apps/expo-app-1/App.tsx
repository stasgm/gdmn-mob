import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import Notification from './src/components/Notification';
import store from './src/store';
import DrawerNavigator from './src/components/DrawerNavigator';

const newTheme: typeof defaultTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#3e92cc',
  },
};

export default () => {
  return (
    <Provider store={store}>
      <UIProvider theme={newTheme}>
        <NavigationContainer>
          <DrawerNavigator />
          <Notification />
        </NavigationContainer>
      </UIProvider>
    </Provider>
  );
};
