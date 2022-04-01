import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import {
  appActions,
  appSelectors,
  // authActions,
  authSelectors,
  settingsActions,
  useDispatch,
  useSelector,
} from '@lib/store';

import { globalStyles as styles, AppScreen, Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { ISettingsOption } from '@lib/types';

import { appTradeActions, store, useSelector as useAppTradeSelector } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import GoodMatrixNavigator from './src/navigation/Root/GoodMatrixNavigator';

import { appSettings } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = [
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
  ];

  const dispatch = useDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    // console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const isGetReferences = useSelector((state) => state.settings?.data.getReferences);

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

  const tradeLoadingError = useAppTradeSelector<string>((state) => state.appTrade.loadingError);

  const onClearLoadingErrors = () => dispatch(appTradeActions.setLoadingError(''));

  return authLoading || loading || appLoading || tradeLoading || appDataLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary} />
      <Caption style={styles.title}>
        {appDataLoading || tradeLoading
          ? 'Загрузка данных...'
          : appLoading
          ? 'Синхронизация данных..'
          : 'Пожалуйста, подождите..'}
      </Caption>
    </AppScreen>
  ) : (
    <MobileApp items={navItems} loadingErrors={[tradeLoadingError]} onClearLoadingErrors={onClearLoadingErrors} />
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
