import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { dialCall, sleep } from '@lib/mobile-hooks';
import { GDMN_EMAIL, GDMN_PHONE, GDMN_SITE_ADDRESS, INavItem } from '@lib/mobile-navigation';
import ErrorBoundary from 'react-native-error-boundary';

import { StatusBar } from 'expo-status-bar';

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
  PrimeButton,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, Text } from 'react-native-paper';

import { IDocument, IReferences, ISettingsOption } from '@lib/types';

import { TouchableOpacity, Linking, View } from 'react-native';

import Constants from 'expo-constants';

import { ScrollView } from 'react-native-gesture-handler';

import { DocNavigator } from './src/navigation/DocNavigator';

import { store, useSelector as useInvSelector, appInventoryActions } from './src/store';

import { appSettings, ONE_SECOND_IN_MS } from './src/utils/constants';

import { messageGdMovement } from './src/store/mock';

import RemainsNavigator from './src/navigation/RemainsNavigator';
import { ScanNavigator } from './src/navigation/ScanNavigator';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Doc',
        title: 'Документы',
        icon: 'file-document-outline',
        component: DocNavigator,
      },
      {
        name: 'Scan',
        title: 'Сканирование',
        icon: 'barcode-scan',
        component: ScanNavigator,
      },
      {
        name: 'Remains',
        title: 'Остатки',
        icon: 'dolly',
        component: RemainsNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const getReferences = useSelector((state) => state.settings?.data?.getReferences);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const isLogged = authSelectors.isLoggedWithCompany();
  const invLoading = useInvSelector((state) => state.appInventory.loading);
  const isDemo = useSelector((state) => state.auth.isDemo);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);

  const refDispatch = useRefThunkDispatch();
  const docDispatch = useDocThunkDispatch();

  const getMessages = useCallback(async () => {
    await sleep(ONE_SECOND_IN_MS);
    await refDispatch(
      referenceActions.setReferences(
        messageGdMovement.find((m) => m.body.type === 'REFS')?.body.payload as IReferences,
      ),
    );
    await docDispatch(
      documentActions.setDocuments(messageGdMovement.find((m) => m.body.type === 'DOCS')?.body.payload as IDocument[]),
    );
  }, [docDispatch, refDispatch]);

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
      dispatch(
        settingsActions.updateOption({
          optionName: 'getReferences',
          value: { ...getReferences, data: false } as ISettingsOption,
        }),
      );
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

  const invLoadingError = useInvSelector<string>((state) => state.appInventory.loadingError);

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

  const onClearLoadingErrors = () => dispatch(appInventoryActions.setLoadingError(''));

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      {infoWindow === 1 ? (
        <AppScreen>
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            maintainVisibleContentPosition={{ autoscrollToTopThreshold: 1, minIndexForVisible: 0 }}
            style={styles.scrollContainer}
          >
            <Text style={[styles.textInfo]}>
              {
                'Добро пожаловать в GDMN Склад!\n\nПриложение облегчает ведение складского учета и позволяет выполнить следующие действия: \n\n1. Оформить документы складского движения, такие как "Приход", "Внутреннее перемещение", "Возврат поставщику" и т.д. \n\n2. Провести инвентаризацию товаров \n\n3. Зарегистрировать операции при помощи сканера штрих-кодов'
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
              <Text style={[styles.textInfo]}>{'« Назад'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSetInfoWindow_2}>
              <Text style={[styles.textInfo]}>{'Далее »'}</Text>
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
          <TouchableOpacity onPress={() => Linking.openURL(Constants.manifest?.extra?.documentationUrl)}>
            <Text style={[styles.textInfo, styles.textDecorationLine]}>{'документации.'}</Text>
          </TouchableOpacity>
          <Text style={styles.textInfo}>
            {
              '\nВыявленные ошибки и пожелания оставляйте в системе регистрации.\n\nСпасибо за использование GDMN Склад!\n\n'
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
      ) : authLoading || loading || invLoading || appDataLoading ? (
        <AppScreen>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Caption style={styles.title}>
            {appDataLoading || invLoading ? 'Загрузка данных...' : 'Пожалуйста, подождите..'}
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
      <StatusBar style="auto" />
    </UIProvider>
  </Provider>
);

export default App;
