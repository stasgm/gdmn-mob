import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import ErrorBoundary from 'react-native-error-boundary';

import {
  appActions,
  appSelectors,
  authSelectors,
  documentActions,
  referenceActions,
  settingsActions,
  useDispatch,
  useDocThunkDispatch,
  useRefThunkDispatch,
  useSelector,
} from '@lib/store';
import {
  AppScreen,
  globalStyles as styles,
  Theme as defaultTheme,
  Provider as UIProvider,
  AppFallback,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme, MD2Theme } from 'react-native-paper';

import { sleep } from '@lib/mobile-hooks';

import { IDocument, IReferences } from '@lib/types';

import { MovementNavigator } from './src/navigation/MovementNavigator';

import { store, useSelector as useInvSelector, appMovementActions } from './src/store';
import { appSettings, ONE_SECOND_IN_MS } from './src/utils/constants';
import { messageBcMovement } from './src/store/mock';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Movement',
        title: 'Перемещение',
        icon: 'file-document-outline',
        component: MovementNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();
  const { colors } = useTheme<MD2Theme>();

  const isInit = useSelector((state) => state.settings.isInit);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const isLogged = authSelectors.isLoggedWithCompany();
  const isDemo = useSelector((state) => state.auth.isDemo);

  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();

  const getMessages = useCallback(async () => {
    await sleep(ONE_SECOND_IN_MS);
    await refDispatch(
      referenceActions.setReferences(
        messageBcMovement.find((m) => m.body.type === 'REFS')?.body.payload as IReferences,
      ),
    );
    await docDispatch(
      documentActions.setDocuments(messageBcMovement.find((m) => m.body.type === 'DOCS')?.body.payload as IDocument[]),
    );
  }, [docDispatch, refDispatch]);

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  useEffect(() => {
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

  useEffect(() => {
    if (isDemo) {
      //Если включен демо режим, то запускаем получение данных из мока
      getMessages();
    }
  }, [isDemo, getMessages]);

  const invLoadingError = useInvSelector<string>((state) => state.appMovement.loadingError);

  const onClearLoadingErrors = () => dispatch(appMovementActions.setLoadingError(''));

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      {authLoading || loading || appDataLoading ? (
        <AppScreen>
          <ActivityIndicator size="large" color={colors.primary} />
          <Caption style={styles.title}>{appDataLoading ? 'Загрузка данных...' : 'Пожалуйста, подождите..'}</Caption>
        </AppScreen>
      ) : (
        <MobileApp items={navItems} loadingErrors={[invLoadingError]} onClearLoadingErrors={onClearLoadingErrors} />
      )}
    </ErrorBoundary>
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
