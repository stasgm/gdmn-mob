import React, { useMemo } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import ApplNavigator from './src/navigation/Root/ApplNavigator';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Appl',
        title: 'Заявки',
        icon: 'clipboard-list-outline',
        component: ApplNavigator,
      },
    ],
    [],
  );

  // const handleSync = async () => {
  //   setLoading(true);

  //   await dispatch(referenceActions.clearReferences());
  //   await dispatch(documentActions.clearDocuments());
  //   await dispatch(messageActions.clearMessages());

  //   await dispatch(
  //     messageActions.fetchMessages({
  //       companyId: company!.id,
  //       systemId: 'gdmn-appl-request',
  //     }),
  //   );

  //   // dispatch(referenceActions.addReferences(applRefs));
  //   // dispatch(documentActions.addDocuments(applDocuments));
  //   dispatch(messageActions.addMessages(applMessages));

  //   setLoading(false);
  // };

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems}/>
  )};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;
