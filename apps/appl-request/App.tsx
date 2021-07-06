import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { useDispatch, documentActions, referenceActions, messageActions } from '@lib/store';

import { store } from './src/store';

import { applDocuments, applDocuments2, applRefs } from './src/store/mock';
import { applMessages } from './src/store/docsMock';

import ApplNavigator from './src/navigation/Root/ApplNavigator';

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

    console.log('Загрузка данных');
    dispatch(referenceActions.deleteAllReferences());
    dispatch(referenceActions.deleteAllReferences());
    dispatch(documentActions.deleteDocuments());
    dispatch(messageActions.deleteAllMessages());

    dispatch(referenceActions.addReferences(applRefs));
    dispatch(documentActions.addDocuments(applDocuments2));
    dispatch(messageActions.addMessages(applMessages));

    setLoading(false);
  };

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужна
    <MobileApp items={navItems} onSync={handleSync} syncing={isLoading} />
  );
});

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
