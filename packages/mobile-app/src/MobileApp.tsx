import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Store } from 'redux';

import {
  authActions,
  authSelectors,
  documentActions,
  referenceActions,
  settingsActions,
  useAuthThunkDispatch,
  useDispatch,
  useSelector,
} from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { globalStyles, Theme as defaultTheme } from '@lib/mobile-ui';

import api from '@lib/client-api';

import { Snackbar } from 'react-native-paper';
import { View, Text, Alert, AppState } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { AuthLogOut } from '@lib/types';
import { truncate, useSync } from '@lib/mobile-hooks';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => Promise<any>;
  loadingErrors?: string[];
  onClearLoadingErrors?: () => void;
}

// const getMinsUntilNextSynch = (lastSyncTime: Date, synchPeriod: number) => {
//   const nextTime = new Date(lastSyncTime);
//   nextTime.setMinutes(nextTime.getMinutes() + synchPeriod);
//   return Math.round((nextTime.getTime() - new Date().getTime()) / 60000);
// };

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const sync = useSync(onSync);

  const syncDate = useSelector((state) => state.app.syncDate) as Date;
  const settings = useSelector((state) => state.settings?.data);
  const synchPeriod = (settings.synchPeriod?.data as number) || 10;
  const autoSync = (settings.autoSync?.data as boolean) || false;
  const { config, user } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.app.loading);
  // const [manualSync, setManualSync] = useState(false);
  // console.log('synchPeriod', synchPeriod);

  // useEffect(() => {
  //   if (!loading) {
  //     setManualSync(false);
  //   }
  // }, [loading]);

  // const handleSyncData = useCallback(() => {
  //   if (loading) {
  //     return;
  //   }

  //   if (!syncDate) {
  //     sync();
  //     return;
  //   }

  //   const mins = getMinsUntilNextSynch(syncDate, synchPeriod);

  //   if (mins > 0) {
  //     Alert.alert(
  //       'Внимание!',
  //       // eslint-disable-next-line max-len
  //       `В настоящее время сервер обрабатывает запрос.\nПовторная синхронизация возможна через ${mins} мин.`,
  //       [{ text: 'OK' }],
  //     );
  //   } else {
  //     sync();
  //   }
  // }, [loading, syncDate, synchPeriod]);

  useEffect(() => {
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config };
  }, []);

  const appState = useRef(AppState.currentState);

  const authDispatch = useAuthThunkDispatch();

  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        //Проверка сессии при фокусе приложения, можно getUser заменить на другую с Middleware
        await api.user.getUser(user!.id, authMiddleware);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const timeOutRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (loading || !autoSync) {
      return;
    }
    timeOutRef.current = setInterval(() => {
      if (!loading) {
        sync();
      }
    }, synchPeriod * 60 * 1000);

    return () => {
      if (timeOutRef.current) {
        clearInterval(timeOutRef.current);
      }
    };
  }, [synchPeriod, autoSync]);

  return <DrawerNavigator items={items} onSyncClick={sync} />;
};

const MobileApp = ({ store, loadingErrors, onClearLoadingErrors, ...props }: IApp) => {
  const dispatch = useDispatch();
  const authLoadingError = useSelector<string>((state) => state.auth.loadingError);
  const docsLoadingError = useSelector<string>((state) => state.documents.loadingError);
  const refsLoadingError = useSelector<string>((state) => state.references.loadingError);
  const setsLoadingError = useSelector<string>((state) => state.settings.loadingError);

  /**Массив ошибок при считывание\сохранении с диска данных из общего стора и из стора приложений  */
  const errList: string[] = useMemo(
    () =>
      [...(loadingErrors || []), authLoadingError, docsLoadingError, refsLoadingError, setsLoadingError].filter(
        (err) => !!err,
      ),
    [loadingErrors, authLoadingError, docsLoadingError, refsLoadingError, setsLoadingError],
  );

  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    if (errList.length) {
      setBarVisible(true);
    }
  }, [errList]);

  const closeSnackbar = () => {
    authLoadingError && dispatch(authActions.setLoadingError(''));
    docsLoadingError && dispatch(documentActions.setLoadingError(''));
    refsLoadingError && dispatch(referenceActions.setLoadingError(''));
    setsLoadingError && dispatch(settingsActions.setLoadingError(''));
    loadingErrors?.length && onClearLoadingErrors && onClearLoadingErrors();
    setBarVisible(false);
  };

  const SnackbarComponent = () => (
    <Snackbar
      visible={barVisible}
      onDismiss={closeSnackbar}
      style={{ backgroundColor: defaultTheme.colors.error }}
      action={{
        icon: 'close',
        label: '',
        onPress: closeSnackbar,
      }}
    >
      <View style={globalStyles.container}>
        {!!errList?.length && errList.map((err, id) => <Text key={id}>{truncate(err)}</Text>)}
      </View>
    </Snackbar>
  );

  return (
    <NavigationContainer theme={defaultTheme}>
      {authSelectors.isLoggedWithCompany() ? <AppRoot {...props} /> : <AuthNavigator />}
      <SnackbarComponent />
    </NavigationContainer>
  );
};

export default MobileApp;
