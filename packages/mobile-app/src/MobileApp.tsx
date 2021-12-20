import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { useSelector } from '@lib/store';

import { useSync } from './hooks';
import api from '@lib/client-api';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => void;
}

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const handleSyncData = useSync(onSync);

  const settings = useSelector( state => state.auth.settings );

  useEffect(() => {
    // authDispatch(authActions.init());
    // //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...settings };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DrawerNavigator items={items} onSyncClick={handleSyncData} />;
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
