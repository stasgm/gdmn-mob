import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { dialCall, MobileApp } from '@lib/mobile-app';
import { GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS, INavItem } from '@lib/mobile-navigation';
import ErrorBoundary from 'react-native-error-boundary';

import {
  appActions,
  appSelectors,
  authActions,
  authSelectors,
  documentActions,
  referenceActions,
  settingsActions,
  useAuthThunkDispatch,
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
  PrimeButton,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, Text } from 'react-native-paper';

import { IDocument, IReferences, IUserSettings } from '@lib/types';

import { sleep } from '@lib/client-api';

import { TouchableOpacity, Linking } from 'react-native';

import { MoveNavigator } from './src/navigation/MoveNavigator';

import { store, useSelector as useFpSelector, fpMovementActions } from './src/store';

import { appSettings, ONE_SECOND_IN_MS } from './src/utils/constants';

import { messageFpMovement } from './src/store/mock';
import { FreeSellbillNavigator } from './src/navigation/FreeSellbillNavigator';
import { SellbillNavigator } from './src/navigation/SellbillNavigator';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Movement',
        title: 'Перемещение',
        icon: 'transfer',
        component: MoveNavigator,
      },
      {
        name: 'SellBill',
        title: 'Отвес по заявке',
        icon: 'playlist-check',
        component: SellbillNavigator,
      },
      {
        name: 'FreeSellbill',
        title: 'Отвес',
        icon: 'playlist-plus',
        component: FreeSellbillNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const isLogged = authSelectors.isLoggedWithCompany();
  const fpLoading = useFpSelector((state) => state.fpMovement.loading);
  const isDemo = useSelector((state) => state.auth.isDemo);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);

  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();
  const authDispatch = useAuthThunkDispatch();

  const getMessages = useCallback(async () => {
    await sleep(ONE_SECOND_IN_MS);
    await refDispatch(
      referenceActions.setReferences(
        messageFpMovement.find((m) => m.body.type === 'REFS')?.body.payload as IReferences,
      ),
    );
    await docDispatch(
      documentActions.setDocuments(messageFpMovement.find((m) => m.body.type === 'DOCS')?.body.payload as IDocument[]),
    );
    await authDispatch(
      authActions.setUserSettings(
        messageFpMovement.find((m) => m.body.type === 'SETTINGS')?.body.payload as IUserSettings,
      ),
    );
  }, [authDispatch, docDispatch, refDispatch]);

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

  const fpLoadingError = useFpSelector<string>((state) => state.fpMovement.loadingError);

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

  const onClearLoadingErrors = () => dispatch(fpMovementActions.setLoadingError(''));

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      {infoWindow === 1 ? (
        <AppScreen>
          <Text style={styles.textInfo}>
            {
              'Добро пожаловать в GDMN Отгрузка!\n\nНаше приложение облегчает процесс перемещения готовой продукции и позволяет выполнить следующие действия: \n\n1. Оформить внутреннее перемещение товаров\n\n2. Создать отвес-накладную по готовой заявке' // \n\n3. Планировать посещение торговых объектов, составлять маршрут и просматривать его на карте\n\n4. Оперативно контролировать задолженность за поставленную продукцию\n\n5. Просматривать юридический адрес, адрес разгрузки и иные реквизиты покупателя\n\n6. Гибко настраивать цены и скидки для конкретного покупателя или группы покупателей'
            }
          </Text>
          <TouchableOpacity
            style={styles.buttonPrev}
            onPress={() => {
              setInfoWindow(0);
              dispatch(appActions.loadGlobalDataFromDisc());
            }}
          >
            <Text style={styles.textInfo}>{'« Назад'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNext} onPress={handleSetInfoWindow_2}>
            <Text style={styles.textInfo}>{'Далее »'}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.buttonPrev} onPress={handleSetInfoWindow_1}>
            <Text style={styles.textInfo}>{'« Назад'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNext} onPress={handleSetInfoWindow_3}>
            <Text style={styles.textInfo}>{'Далее »'}</Text>
          </TouchableOpacity>
        </AppScreen>
      ) : infoWindow === 3 ? (
        <AppScreen>
          <Text style={styles.textInfo}>
            {
              'Подробную информацию об использовании приложения вы найдете в справочной системе.\n\nВыявленные ошибки и пожелания оставляйте в системе регистрации.\n\nСпасибо за использование GDMN Склад!\n\n'
            }
          </Text>
          <TouchableOpacity style={styles.buttonPrev} onPress={handleSetInfoWindow_2}>
            <Text style={styles.textInfo}>{'« Назад'}</Text>
          </TouchableOpacity>
          <PrimeButton icon={'presentation-play'} onPress={handleSetInfoWindow_0}>
            {'Начать работу'}
          </PrimeButton>
        </AppScreen>
      ) : authLoading || loading || fpLoading || appDataLoading ? (
        <AppScreen>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Caption style={styles.title}>
            {appDataLoading || fpLoading ? 'Загрузка данных...' : 'Пожалуйста, подождите..'}
          </Caption>
        </AppScreen>
      ) : (
        <MobileApp
          items={navItems}
          loadingErrors={[fpLoadingError]}
          onClearLoadingErrors={onClearLoadingErrors}
          onGetMessages={isDemo ? getMessages : undefined}
        />
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
