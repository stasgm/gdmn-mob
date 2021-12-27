import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { appSelectors, authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { globalStyles as styles, Theme as defaultTheme, Provider as UIProvider, AppScreen } from '@lib/mobile-ui';

import { useSelector } from '@lib/store';


import { useSync } from './hooks';
import api from '@lib/client-api';
import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => void;
}

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const handleSyncData = useSync(onSync);

  const config = useSelector((state) => state.auth.config );
  const appLoading = appSelectors.selectLoading();
  const { colors } = useTheme();

  useEffect(() => {
    // //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return appLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary} children={undefined}/>
      <Caption style={styles.title}>{'Синхронизация данных...'}</Caption>
    </AppScreen>
  ) : (
    <DrawerNavigator items={items} onSyncClick={handleSyncData} />
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
