import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import { configureStore, authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import RootNavigator from './src/navigation/RootNavigator';
// import config from './src/config';

enableScreens();

const Router = () => (authSelectors.isLogged() ? <RootNavigator /> : <AuthNavigator />);

const App = () => {
  return (
    <Provider store={configureStore}>
      <UIProvider theme={defaultTheme}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </UIProvider>
    </Provider>
  );
};

export default App;
