import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import { configureStore, authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import RootNavigator from './src/navigation/RootNavigator';

enableScreens();

const store = configureStore();

const App = () => {
  const Router = () => (authSelectors.isLoggedWithCompany() ? <RootNavigator /> : <AuthNavigator />);
  // const Router = () => <RootNavigator />;

  return (
    <Provider store={store}>
      <UIProvider theme={defaultTheme}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </UIProvider>
    </Provider>
  );
};

export default App;
