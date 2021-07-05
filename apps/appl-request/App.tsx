import React, { useMemo, useState } from 'react';
import { MobileApp } from '@lib/mobile-app';
/* import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { authSelectors } from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import RootNavigator from './src/navigation/RootNavigator';
 */
import { INavItem } from '@lib/mobile-navigation';
import { Provider } from 'react-redux';
import { useDispatch, documentActions, referenceActions } from '@lib/store';

import { store } from './src/store';

import { applDocuments, applRefs } from './src/store/mock';

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

    // dispatch(referenceActions.deleteAllReferences());
    dispatch(referenceActions.deleteAllReferences());
    dispatch(documentActions.deleteDocuments());

    dispatch(referenceActions.addReferences(applRefs));
    dispatch(documentActions.addDocuments(applDocuments));

    setLoading(false);
  };

  return (
    // <MobileApp store={store} items={navItems} onSync={handleSync} syncing={isLoading} />
    <MobileApp items={navItems} onSync={handleSync} syncing={isLoading} />
  );
});

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
