import React, { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';

import { store } from './src/store';
import ApplNavigator from './src/navigation/Root/ApplNavigator';
import { appActions, useDispatch, useSelector } from '@lib/store';
import { Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

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

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(documentActions.init());
    // dispatch(appTradeActions.init());
    // dispatch(referenceActions.init());
    // dispatch(settingsActions.init());
    // dispatch(authActions.init());
    // saveDataToDisk('documents', store.getState().documents, '5ae8c930-0584-11ec-991a-779431d580c9');
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('useEffect loadSuperDataFromDisc', user?.id);
    if (!user?.id) {
      return;
    }
    dispatch(appActions.loadSuperDataFromDisc());
  }, [dispatch, user?.id]);

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
    <MobileApp items={navItems} />
  );
};

const App = () => (
  <Provider store={store}>
    <UIProvider theme={defaultTheme}>
      <Root />
    </UIProvider>
  </Provider>
);

export default App;
