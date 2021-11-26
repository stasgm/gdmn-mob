import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './src/store';
import { DocumentsNavigator } from './src/navigation/DocumentsNavigator';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Documents',
        title: 'Документы',
        icon: 'file-document-outline',
        component: DocumentsNavigator,
      },
    ],
    [],
  );

  return <MobileApp items={navItems} />;
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;
