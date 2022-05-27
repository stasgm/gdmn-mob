import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';

import {
  appActions,
  appSelectors,
  authSelectors,
  useDispatch,
  useSelector,
  useRefThunkDispatch,
  useDocThunkDispatch,
  referenceActions,
  documentActions,
} from '@lib/store';
import { globalStyles as styles, Theme as defaultTheme, Provider as UIProvider, AppScreen } from '@lib/mobile-ui';
import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { IDocument, IReferences } from '@lib/types';

import { sleep } from '@lib/client-api';

import ApplNavigator from './src/navigation/Root/ApplNavigator';
import { store } from './src/store';

import { messageRequest, ONE_SECOND_IN_MS } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'ApplNav',
        title: 'Заявки',
        icon: 'clipboard-list-outline',
        component: ApplNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const appLoading = useSelector((state) => state.app.loading);
  const isLogged = authSelectors.isLoggedWithCompany();
  const isDemo = useSelector((state) => state.auth.isDemo);

  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();

  const getMessages = useCallback(async () => {
    await sleep(ONE_SECOND_IN_MS);
    await refDispatch(
      referenceActions.setReferences(messageRequest.find((m) => m.body.type === 'REFS')?.body.payload as IReferences),
    );
    await docDispatch(
      documentActions.setDocuments(messageRequest.find((m) => m.body.type === 'DOCS')?.body.payload as IDocument[]),
    );
  }, [refDispatch, docDispatch]);

  useEffect(() => {
    // console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLogged) {
      dispatch(appActions.loadSuperDataFromDisc());
    }
  }, [dispatch, isLogged]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return authLoading || loading || appLoading || appDataLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary}>
        <></>
      </ActivityIndicator>
      <Caption style={styles.title}>
        {appDataLoading ? 'Загрузка данных...' : appLoading ? 'Синхронизация данных..' : 'Пожалуйста, подождите..'}
      </Caption>
    </AppScreen>
  ) : (
    <MobileApp items={navItems} onGetMessages={isDemo ? getMessages : undefined} />
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
