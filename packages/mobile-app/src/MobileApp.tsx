import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import {
  authActions,
  authSelectors,
  documentActions,
  referenceActions,
  settingsActions,
  useDispatch,
  useSelector,
} from '@lib/store';
import { AuthNavigator } from '@lib/mobile-auth';
import { DrawerNavigator, INavItem } from '@lib/mobile-navigation';
import { Theme as defaultTheme, Provider as UIProvider, Theme, globalStyles } from '@lib/mobile-ui';

import api from '@lib/client-api';

import { Snackbar } from 'react-native-paper';
import { View, Text } from 'react-native';

import { useSync } from './hooks';
import { truncate } from './utils/helpers';

export interface IApp {
  items?: INavItem[];
  store?: Store<any, any>;
  onSync?: () => Promise<any>;
  onGetMessages?: () => Promise<any>;
  loadingErrors?: string[];
  onClearLoadingErrors?: () => void;
}

const AppRoot = ({ items, onSync, onGetMessages }: Omit<IApp, 'store'>) => {
  const handleSyncData = useSync(onSync, onGetMessages);
  const config = useSelector((state) => state.auth.config);

  useEffect(() => {
    // //При запуске приложения записываем настройки в апи
    api.config = { ...api.config, ...config };
  }, []);

  return <DrawerNavigator items={items} onSyncClick={handleSyncData} />;
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
      style={{ backgroundColor: Theme.colors.error }}
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

  const Router = () => (
    <>
      {authSelectors.isLoggedWithCompany() ? <AppRoot {...props} /> : <AuthNavigator />}
      <SnackbarComponent />
    </>
  );

  return store ? (
    <Provider store={store}>
      <UIProvider theme={defaultTheme}>
        <ActionSheetProvider>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </ActionSheetProvider>
      </UIProvider>
    </Provider>
  ) : (
    <UIProvider theme={defaultTheme}>
      <ActionSheetProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </ActionSheetProvider>
    </UIProvider>
  );
};

export default MobileApp;
