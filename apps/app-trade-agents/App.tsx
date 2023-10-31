import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { dialCall, sleep } from '@lib/mobile-hooks';
import { INavItem, GDMN_PHONE, GDMN_EMAIL, GDMN_SITE_ADDRESS } from '@lib/mobile-navigation';

import { StatusBar } from 'expo-status-bar';

import {
  appActions,
  appSelectors,
  referenceActions,
  documentActions,
  settingsActions,
  useDispatch,
  useRefThunkDispatch,
  useDocThunkDispatch,
  useSelector,
  authSelectors,
} from '@lib/store';

import {
  globalStyles as styles,
  AppScreen,
  Theme as defaultTheme,
  Provider as UIProvider,
  PrimeButton,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, Text } from 'react-native-paper';

import { IDocument, IReferences } from '@lib/types';

import Constants from 'expo-constants';

import { appTradeActions, store, useSelector as useAppTradeSelector } from './src/store';

import { RoutesNavigator, OrdersNavigator, DebetsNavigator, MapNavigator, GoodMatrixNavigator } from './src/navigation';

import { appSettings, ONE_SECOND_IN_MS } from './src/utils/constants';
import { messageAgent } from './src/store/mock';
import ReportsNavigator from './src/navigation/Root/ReportsNavigator';

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
        name: 'ReportsNav',
        title: 'Отчёты',
        icon: 'text-box-search-outline',
        component: ReportsNavigator,
      },
      {
        name: 'DebetsNav',
        title: 'Задолженности',
        icon: 'currency-usd',
        component: DebetsNavigator,
      },
      {
        name: 'GoodMatrixNav',
        title: 'Матрицы',
        icon: 'tag-text-outline',
        component: GoodMatrixNavigator,
      },
      {
        name: 'MapNav',
        title: 'Карта',
        icon: 'map-outline',
        component: MapNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
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
    //isInit - true при открытии приложения или при ручном сбросе настроек
    //До загрузки данных пользователя устанавливаем настройки по умолчанию
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  const appDataLoading = appSelectors.selectLoading();
  const { loadingData: authLoading, user } = useSelector((state) => state.auth);
  const tradeLoading = useAppTradeSelector((state) => state.appTrade.loadingData);
  const tradeLoadingError = useAppTradeSelector<string>((state) => state.appTrade.loadingError);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);
  const isLogged = authSelectors.isLoggedWithCompany();

  const [loading, setLoading] = useState(true);
  const [addSettings, setAddSettings] = useState('INIT');

  useEffect(() => {
    if (isLogged) {
      dispatch(appActions.loadSuperDataFromDisc());
    }
  }, [dispatch, isLogged]);

  useEffect(() => {
    //После загрузки данных пользователя устанавливаем настройки поверх настроек по умолчанию и загруженных из памяти
    //Необходимо при добавлении новых параметров
    if (appDataLoading) {
      if (addSettings === 'INIT') {
        setAddSettings('ADDING');
      }
    } else if (addSettings === 'ADDING') {
      dispatch(settingsActions.addSettings(appSettings));
      setAddSettings('ADDED');
    }
  }, [addSettings, appDataLoading, dispatch]);

  useEffect(() => {
    if (user) {
      setAddSettings('INIT');
    }
  }, [user]);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [infoWindow, setInfoWindow] = useState(0);

  const handleSetInfoWindow_0 = useCallback(() => setInfoWindow(0), []);
  const handleSetInfoWindow_1 = useCallback(() => setInfoWindow(1), []);
  const handleSetInfoWindow_2 = useCallback(() => setInfoWindow(2), []);
  const handleSetInfoWindow_3 = useCallback(() => setInfoWindow(3), []);

  useEffect(() => {
    if (isDemo) {
      //Если включен демо режим, то запускаем получение данных из мока
      getMessages();
      if (connectionStatus === 'connected') {
        handleSetInfoWindow_1();
      }
    }
  }, [isDemo, getMessages, connectionStatus, handleSetInfoWindow_1]);

  const onClearLoadingErrors = () => dispatch(appTradeActions.setLoadingError(''));

  return authLoading || loading || tradeLoading || appDataLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
      <Caption style={styles.title}>
        {appDataLoading || tradeLoading ? 'Загрузка данных...' : 'Пожалуйста, подождите..'}
      </Caption>
    </AppScreen>
  ) : infoWindow === 1 ? (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        maintainVisibleContentPosition={{ autoscrollToTopThreshold: 1, minIndexForVisible: 0 }}
        style={styles.scrollContainer}
      >
        <Text style={styles.textInfo}>
          {
            'Добро пожаловать в GDMN Агент!\n\nПриложение облегчает труд торгового агента и позволяет выполнить следующие действия:\n\n1. Оформить заявку на поставку товаров\n\n2. Оформить возврат непроданных товаров\n\n3. Планировать посещение торговых объектов, составлять маршрут и просматривать его на карте\n\n4. Оперативно контролировать задолженность за поставленную продукцию\n\n5. Просматривать юридический адрес, адрес разгрузки и иные реквизиты покупателя\n\n6. Гибко настраивать цены и скидки для конкретного покупателя или группы покупателей'
          }
        </Text>
      </ScrollView>
      <View style={styles.infoButtons}>
        <TouchableOpacity
          onPress={() => {
            setInfoWindow(0);
            dispatch(appActions.loadGlobalDataFromDisc());
          }}
        >
          <Text style={styles.textInfo}>{'« Назад'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSetInfoWindow_2}>
          <Text style={styles.textInfo}>{'Далее »'}</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  ) : infoWindow === 2 ? (
    <AppScreen>
      <Text style={styles.textInfo}>
        {
          'Вы находитесь в демонстрационном режиме и работаете с вымышленными данными.\n\nДля подключения приложения к торговой или складской системе вашего предприятия обратитесь в компанию ООО Амперсант (торговая марка Golden Software)\n'
        }
      </Text>
      <TouchableOpacity onPress={() => dialCall(GDMN_PHONE)}>
        <Text style={styles.textInfo}>{`Телефон: ${GDMN_PHONE}\n`}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${GDMN_EMAIL}`)}>
        <Text style={styles.textInfo}>{`Email: ${GDMN_EMAIL}\n`}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL(GDMN_SITE_ADDRESS)}>
        <Text style={[styles.textInfo, styles.textReference]}>{GDMN_SITE_ADDRESS}</Text>
      </TouchableOpacity>
      <View style={styles.infoButtons}>
        <TouchableOpacity onPress={handleSetInfoWindow_1}>
          <Text style={styles.textInfo}>{'« Назад'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSetInfoWindow_3}>
          <Text style={styles.textInfo}>{'Далее »'}</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  ) : infoWindow === 3 ? (
    <AppScreen>
      <Text style={styles.textInfo}>{'Подробную информацию об использовании приложения вы найдете в '}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(Constants.expoConfig?.extra?.documentationUrl)}>
        <Text style={[styles.textInfo, styles.textDecorationLine]}>{'документации.'}</Text>
      </TouchableOpacity>
      <Text style={styles.textInfo}>
        {
          '\nВыявленные ошибки и пожелания оставляйте в системе регистрации.\n\nСпасибо за использование GDMN Агент!\n\n'
        }
      </Text>
      <View style={styles.infoButtons}>
        <TouchableOpacity onPress={handleSetInfoWindow_2}>
          <Text style={styles.textInfo}>{'« Назад'}</Text>
        </TouchableOpacity>
      </View>
      <PrimeButton icon={'presentation-play'} onPress={handleSetInfoWindow_0}>
        Начать работу
      </PrimeButton>
    </AppScreen>
  ) : (
    <MobileApp items={navItems} loadingErrors={[tradeLoadingError]} onClearLoadingErrors={onClearLoadingErrors} />
  );
};

const App = () => (
  <Provider store={store}>
    <UIProvider theme={defaultTheme}>
      <Root />
      <StatusBar style="auto" />
    </UIProvider>
  </Provider>
);

export default App;
