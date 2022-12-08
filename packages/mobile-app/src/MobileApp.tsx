import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, AppState } from 'react-native';
import { Store } from 'redux';

import { NavigationContainer } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

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

import { NavigationContainer } from '@react-navigation/native';

import { mobileRequest, truncate, useSync } from '@lib/mobile-hooks';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => Promise<any>;
  loadingErrors?: string[];
  onClearLoadingErrors?: () => void;
}

const AppRoot = ({ items, onSync }: Omit<IApp, 'store'>) => {
  const { syncData } = useSync(onSync);
  const settings = useSelector((state) => state.settings?.data);
  const synchPeriod = (settings.synchPeriod?.data as number) || 10;
  const autoSync = (settings.autoSync?.data as boolean) || false;
  const { config, user } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.app.loading);

  const appState = useRef(AppState.currentState);
  const authDispatch = useAuthThunkDispatch();

  useEffect(() => {
    //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        //Проверка сессии при фокусе приложения, можно getUser заменить на другую с Middleware
        await api.user.getUser(mobileRequest(authDispatch, authActions), user!.id);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [authDispatch, user]);

  const timeOutRef = useRef<NodeJS.Timer | null>(null);

  //Если в параметрах указана Автосинхронизация,
  //устанавливаем запуск следующей синхронизации через synchPeriod минут
  useEffect(() => {
    if (!autoSync || loading) {
      return;
    }

    timeOutRef.current = setTimeout(() => {
      syncData();
    }, synchPeriod * 60 * 1000);

    return () => {
      if (timeOutRef.current) {
        clearInterval(timeOutRef.current);
        timeOutRef.current = null;
      }
    };
  }, [synchPeriod, autoSync, loading, syncData]);

  return <DrawerNavigator items={items} onSyncClick={syncData} />;
};

const MobileApp = ({ loadingErrors, onClearLoadingErrors, ...props }: IApp) => {
  const dispatch = useDispatch();
  const { loadingError: authLoadingError, errorMessage } = useSelector((state) => state.auth);
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

  const closeSnackbar = useCallback(() => {
    authLoadingError && dispatch(authActions.setLoadingError(''));
    docsLoadingError && dispatch(documentActions.setLoadingError(''));
    refsLoadingError && dispatch(referenceActions.setLoadingError(''));
    setsLoadingError && dispatch(settingsActions.setLoadingError(''));
    loadingErrors?.length && onClearLoadingErrors && onClearLoadingErrors();
    setBarVisible(false);
  }, [
    authLoadingError,
    dispatch,
    docsLoadingError,
    loadingErrors?.length,
    onClearLoadingErrors,
    refsLoadingError,
    setsLoadingError,
  ]);

  const closeErrBar = () => {
    dispatch(authActions.setErrorMessage(''));
    dispatch(authActions.clearError());
  };

  return (
    <NavigationContainer theme={defaultTheme}>
      <Snackbar
        visible={!!errorMessage}
        onDismiss={closeErrBar}
        style={localStyles.snack}
        action={{
          icon: 'close',
          label: '',
          onPress: closeErrBar,
          color: 'white',
        }}
      >
        <Text>{errorMessage}</Text>
      </Snackbar>
      {authSelectors.isLoggedWithCompany() ? <AppRoot {...props} /> : <AuthNavigator />}
      <Snackbar
        visible={barVisible}
        onDismiss={closeSnackbar}
        style={{ backgroundColor: defaultTheme.colors.error }}
        action={{
          icon: 'close',
          label: '',
          onPress: closeSnackbar,
          color: 'white',
        }}
      >
        <View style={globalStyles.container}>
          {!!errList?.length && errList.map((err, id) => <Text key={id}>{truncate(err)}</Text>)}
        </View>
      </Snackbar>
    </NavigationContainer>
  );
};

export default MobileApp;

const localStyles = StyleSheet.create({
  snack: {
    backgroundColor: defaultTheme.colors.error,
    zIndex: 1000,
  },
});
