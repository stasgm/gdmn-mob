import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { authActions, authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { settingsActions, useDispatch, useSelector } from '@lib/store';

import { useSync } from './hooks';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => void;
}

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const handleSyncData = useSync(onSync);

  return <DrawerNavigator items={items} onSyncClick={handleSyncData} />;
};

const MobileApp = ({ store, ...props }: IApp) => {
  // const { settings, connectionStatus } = useSelector((state) => state.auth);

  // const authDispatch = useDispatch();

  // useEffect(() => {
  //   authDispatch(authActions.init());
  //   // console.log('init connectionStatus', connectionStatus);
  //   // if (connectionStatus === 'init') {
  //   //   return;
  //   // }
  //   // if (settings.debug?.isMock) {
  //   //   console.log('useEffect first demo');
  //   //   authDispatch(authActions.setConnectionStatus('init'));
  //   // } else if (connectionStatus !== 'not-connected') {
  //   //   console.log('useEffect first demo 2');
  //   //   authDispatch(authActions.setConnectionStatus('not-connected'));
  //   // }
  // }, []);

  // console.log('MobileApp', connectionStatus);

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
