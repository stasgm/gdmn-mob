import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import {
  appActions,
  appSelectors,
  // authActions,
  authSelectors,
  referenceActions,
  documentActions,
  settingsActions,
  useDispatch,
  useRefThunkDispatch,
  useDocThunkDispatch,
  useSelector,
} from '@lib/store';

import { globalStyles as styles, AppScreen, Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { ActivityIndicator, Caption } from 'react-native-paper';

import { IDocument, IReferences, ISettingsOption } from '@lib/types';

import { sleep } from '@lib/client-api';

import { appTradeActions, store, useSelector as useAppTradeSelector } from './src/store';

import {
  RoutesNavigator,
  OrdersNavigator,
  ReturnsNavigator,
  MapNavigator,
  GoodMatrixNavigator,
} from './src/navigation';

import { appSettings, messageAgent, ONE_SECOND_IN_MS } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'RoutesNav',
        title: 'Маршруты',
        icon: 'routes',
        component: RoutesNavigator,
      },
      {
        name: 'OrdersNav',
        title: 'Заявки',
        icon: 'clipboard-list-outline',
        component: OrdersNavigator,
      },
      {
        name: 'ReturnsNav',
        title: 'Возвраты',
        icon: 'file-restore',
        component: ReturnsNavigator,
      },
      {
        name: 'MapNav',
        title: 'Карта',
        icon: 'map-outline',
        component: MapNavigator,
      },
      {
        name: 'GoodMatrixNav',
        title: 'Матрицы',
        icon: 'tag-text-outline',
        component: GoodMatrixNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const isGetReferences = useSelector((state) => state.settings?.data.getReferences);
  const isDemo = useSelector((state) => state.auth.isDemo);

  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();

  //Для получения демо данных в useSync
  const getMessages = useCallback(async () => {
    await sleep(ONE_SECOND_IN_MS);
    await refDispatch(
      referenceActions.setReferences(messageAgent.find((m) => m.body.type === 'REFS')?.body.payload as IReferences),
    );
    await docDispatch(
      documentActions.setDocuments(messageAgent.find((m) => m.body.type === 'DOCS')?.body.payload as IDocument[]),
    );
  }, [docDispatch, refDispatch]);

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
      dispatch(
        settingsActions.updateOption({
          optionName: 'getReferences',
          value: { ...isGetReferences, data: false } as ISettingsOption,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  const appDataLoading = appSelectors.selectLoading();
  const appLoading = useSelector((state) => state.app.loading);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const tradeLoading = useAppTradeSelector((state) => state.appTrade.loadingData);
  const isLogged = authSelectors.isLoggedWithCompany();
  const tradeLoadingError = useAppTradeSelector<string>((state) => state.appTrade.loadingError);

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

  const onClearLoadingErrors = () => dispatch(appTradeActions.setLoadingError(''));

  return authLoading || loading || appLoading || tradeLoading || appDataLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
      <Caption style={styles.title}>
        {appDataLoading || tradeLoading
          ? 'Загрузка данных...'
          : appLoading
          ? 'Синхронизация данных..'
          : 'Пожалуйста, подождите..'}
      </Caption>
    </AppScreen>
  ) : (
    <MobileApp
      items={navItems}
      loadingErrors={[tradeLoadingError]}
      onClearLoadingErrors={onClearLoadingErrors}
      onGetMessages={isDemo ? getMessages : undefined}
    />
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
