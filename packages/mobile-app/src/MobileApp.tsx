import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { settingsActions, useDispatch, useSelector } from '@lib/store';

import { useSync } from './hooks';

import { IBaseSettings, ISettingsOption, Settings } from '@lib/types';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => void;
  appSettings?: Settings<IBaseSettings>;
}

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const handleSyncData = useSync(onSync);

  return <DrawerNavigator items={items} onSyncClick={handleSyncData} />;
};

const MobileApp = ({ store, appSettings, ...props }: IApp) => {
  const dispatch = useDispatch();

  const Router = () => (authSelectors.isLoggedWithCompany() ? <AppRoot {...props} /> : <AuthNavigator />);

  const storeSettings = useSelector((state) => state.settings);

  // const handleAdd = (optionName: string, value: ISettingsOption<string | number | boolean>) => {

  //   console.log('{ optionName, value }', { optionName, value });
  //   dispatch(settingsActions.addSettings({ optionName, value }));
  // };


  // console.log('store', storeSettings);
  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = storeSettings.data[optionName];
        // console.log('optionName', optionName, value, storeSet === undefined && value !== undefined);
        if (storeSet === undefined && value !== undefined) {
          dispatch(settingsActions.addSettings({ optionName, value }));
          console.log('value', value);
        }
      })
    }
  }, []);

  // console.log('example', a);
  // const handleAdd = (optionName: string, value: { settings }: IApp /*, 'settings'/*ISettingsOption<string | number | boolean>*/) => {

  //   console.log('{ optionName, value }', { optionName, value });
  //   dispatch(settingsActions.addSettings({ optionName, value }));
  // };

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
