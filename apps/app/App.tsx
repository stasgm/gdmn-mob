import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { persistor, store } from './src/store';
import DrawerNavigator from './src/navigation/DrawerNavigator';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};
export default class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<View />} persistor={persistor}>
          <PaperProvider theme={theme}>
            {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
            <NavigationContainer>
              <DrawerNavigator />
            </NavigationContainer>
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}
