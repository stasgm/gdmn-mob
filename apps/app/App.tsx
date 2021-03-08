import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';

import { AuthProvider } from '@lib/mob-auth';

import { persistor, store } from './src/store';

import theme from './src/styles/theme';

import Routes from './src/routes';

export default class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<View />} persistor={persistor}>
          <AuthProvider>
            <PaperProvider theme={theme}>
              {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
              <NavigationContainer>
                <Routes />
              </NavigationContainer>
            </PaperProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    );
  }
}
