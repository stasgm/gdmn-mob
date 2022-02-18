import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import ErrorBoundary from 'react-native-error-boundary';

import { appActions, appSelectors, authSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';
import {
  AppScreen,
  globalStyles as styles,
  Theme as defaultTheme,
  Provider as UIProvider,
  AppFallback,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { MovementNavigator } from './src/navigation/MovementNavigator';

import { store, useSelector as useInvSelector, appMovementActions } from './src/store';
import { appSettings } from './src/utils/constants';

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
  const { colors } = useTheme();

  const isInit = useSelector((state) => state.settings.isInit);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const appLoading = useSelector((state) => state.app.loading);
  const isLogged = authSelectors.isLoggedWithCompany();

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  useEffect(() => {
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

  const invLoadingError = useInvSelector<string>((state) => state.appMovement.loadingError);

  const onClearLoadingErrors = () => dispatch(appMovementActions.setLoadingError(''));

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      {authLoading || loading || appLoading || appDataLoading ? (
        <AppScreen>
          <ActivityIndicator size="large" color={colors.primary} />
          <Caption style={styles.title}>
            {appDataLoading ? 'Загрузка данных...' : appLoading ? 'Синхронизация данных..' : 'Пожалуйста, подождите..'}
          </Caption>
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
