import { Linking, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { dialCall, MobileApp } from '@lib/mobile-app';
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

import { ActivityIndicator, Caption, Text } from 'react-native-paper';

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

import { appSettings, ONE_SECOND_IN_MS } from './src/utils/constants';
import { messageAgent } from './src/store/mock';

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
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);

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

  const [mode, setMode] = useState(0);

  useEffect(() => {
    if (isDemo) {
      //Если включен демо режим, то запускаем получение данных из мока
      getMessages();
      if (connectionStatus === 'connected') {
        setMode(1);
      }
    }
  }, [isDemo, getMessages, connectionStatus]);

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
  ) : mode === 1 ? (
    <AppScreen>
      <Text style={styles.textInfo}>
        {
          'Добро пожаловать в GDMN Агент!\n\nНаше приложение облегчает труд торгового агента и позволяет выполнить следующие действия:\n\n1. Оформить заявку на поставку товаров\n\n2. Оформить возврат непроданных товаров\n\n3. Планировать посещение торговых объектов, составлять маршрут и просматривать его на карте\n\n4. Оперативно контролировать задолженность за поставленную продукцию\n\n5. Просматривать юридический адрес, адрес разгрузки и иные реквизиты покупателя\n\n6. Гибко настраивать цены и скидки для конкретного покупателя или группы покупателей'
        }
      </Text>
      <TouchableOpacity style={styles.buttonNext} onPress={() => setMode(2)}>
        <Text style={styles.textInfo}>{'Далее »'}</Text>
      </TouchableOpacity>
    </AppScreen>
  ) : mode === 2 ? (
    <AppScreen>
      <Caption style={styles.textInfo}>
        {
          'Вы находитесь в демонстрационном режиме и работаете с вымышленными данными.\n\nДля подключения приложения к торговой или складской системе вашего предприятия обратитесь в компанию ООО Амперсант (торговая марка Golden Software)\n'
        }
      </Caption>
      <TouchableOpacity onPress={() => dialCall('+375172561759')}>
        <Text style={styles.textInfo}>{'Телефон: +375 17 256 17 59\n'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@gsbelarus.com')}>
        <Text style={styles.textInfo}>{'Email: support@gsbelarus.com\n'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL('http://gsbelarus.com')}>
        <Text style={[styles.textInfo, styles.textReference]}>http://gsbelarus.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonPrev} onPress={() => setMode(1)}>
        <Text style={styles.textInfo}>{'« Назад'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonNext} onPress={() => setMode(3)}>
        <Text style={styles.textInfo}>{'Далее »'}</Text>
      </TouchableOpacity>
    </AppScreen>
  ) : mode === 3 ? (
    <AppScreen>
      <Caption style={styles.textInfo}>
        {
          'Подробную информацию об использовании приложения вы найдете в справочной системе.\n\nВыявленные ошибки и пожелания оставляйте в системе регистрации.\n\nСпасибо за использование GDMN Агент!\n\n'
        }
      </Caption>
      <TouchableOpacity style={styles.buttonPrev} onPress={() => setMode(2)}>
        <Text style={styles.textInfo}>{'« Назад'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMode(0)}>
        <Text style={[styles.textInfo, styles.textReference, styles.textBold]}>Приступить к работе в демо режиме</Text>
      </TouchableOpacity>
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
