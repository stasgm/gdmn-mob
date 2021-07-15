import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { useDispatch, documentActions, referenceActions, messageActions } from '@lib/store';

import { persistor, store } from './src/store';

import { applMessages, applDocuments, applRefs } from './src/store/mock';

import ApplNavigator from './src/navigation/Root/ApplNavigator';
import { PersistGate } from 'redux-persist/integration/react';

const Root = React.memo(() => {
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

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

  const handleSync = async () => {
    setLoading(true);

    dispatch(referenceActions.deleteAllReferences());
    dispatch(documentActions.deleteDocuments());
    dispatch(messageActions.deleteAllMessages());

    // dispatch(referenceActions.addReferences(applRefs));
    // dispatch(documentActions.addDocuments(applDocuments));
    dispatch(messageActions.addMessages(applMessages));

    setLoading(false);
  };

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems} onSync={handleSync} syncing={isLoading} />
  );
});

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;
