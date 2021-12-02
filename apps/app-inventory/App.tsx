import React, { useMemo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { Settings } from '@lib/types';
import { PersistGate } from 'redux-persist/integration/react';
import { settingsActions, useDispatch, useSelector } from '@lib/store';

import { persistor, store } from './src/store';
import { InventorysNavigator } from './src/navigation/InventorysNavigator';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Inventorys',
        title: 'Инвентаризации',
        icon: 'file-document-outline',
        component: InventorysNavigator,
      },
    ],
    [],
  );

  const appSettings: Settings = {
    scannerUse: {
      id: '3',
      sortOrder: 3,
      description: 'Использовать сканер',
      data: true,
      type: 'boolean',
      visible: true,
    },
  };
  ////
  const storeSettings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = storeSettings.data[optionName];
        if (!storeSet && value) {
          dispatch(settingsActions.addSetting({ optionName, value }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSettings]);
  return <MobileApp items={navItems} />;
};

export const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);
