import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';

import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import RootNavigator from './src/navigation/RootNavigator';

import { store, persistor } from './src/store';

const App = () => {
  const Router = () => (authSelectors.isLoggedWithCompany() ? <RootNavigator /> : <AuthNavigator />);
  // const Router = () => <RootNavigator />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UIProvider theme={defaultTheme}>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </UIProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
