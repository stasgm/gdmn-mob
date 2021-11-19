import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { Settings } from '@lib/types';

//import { NavigationContainer } from '@react-navigation/native';
//import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { persistor, store } from './src/store';
import DocumentsNavigator from './src/navigation/DocumentsNavigator';

/* import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import RootNavigator from './src/navigation/RootNavigator';
 */

const Root = () => {
  const navItems: INavItem[] = [
    {
      name: 'Documents',
      title: 'Документы',
      icon: 'file-document-outline',
      component: DocumentsNavigator,
          },
  ];

  const appSettings: Settings = {
    serverName: {
      id: '4',
      sortOrder: 4,
      description: 'Бэк-офис. Адрес сервера',
      data: 'http://192.168.0.70',
      type: 'string',
      visible: true,
    },
    serverPort: {
      id: '5',
      description: 'Бэк-офис. Порт сервера',
      data: '8000',
      type: 'string',
      sortOrder: 5,
      visible: true,
    },
    returnDocTime: {
      id: '6',
      description: 'Время поиска накладных возврата, дн',
      data: 30,
      type: 'number',
      sortOrder: 7,
      visible: true,
    },
  };

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems} />
  );
};


const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;


