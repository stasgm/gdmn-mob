import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';
import api from '@lib/client-api';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => void;
  syncing?: boolean;
}

const AppRoot = ({ items, onSync, syncing }: Omit<IApp, 'store'>) => {
  return (
    <DrawerNavigator
      items={items}
      onSyncClick={api.config.debug?.isMock ? onSync : undefined}
      syncing={api.config.debug?.isMock ? syncing : undefined}
    />
  );
};

const MobileApp = ({ store, ...props }: IApp) => {
  const Router = () => (authSelectors.isLoggedWithCompany() ? <AppRoot {...props} /> : <AuthNavigator />);

  return store ? (
    <Provider store={store}>
      <UIProvider theme={defaultTheme}>
        <ActionSheetProvider>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </ActionSheetProvider>
      </UIProvider>
    </Provider>
  ) : (
    <UIProvider theme={defaultTheme}>
      <ActionSheetProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </ActionSheetProvider>
    </UIProvider>
  );
};

export default MobileApp;
