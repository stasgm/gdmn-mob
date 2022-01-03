import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';

import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';

import { appActions, appSelectors, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles, Theme as defaultTheme, Provider as UIProvider, AppScreen } from '@lib/mobile-ui';
import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import ApplNavigator from './src/navigation/Root/ApplNavigator';
import { store } from './src/store';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'ApplNav',
        title: 'Заявки',
        icon: 'clipboard-list-outline',
        component: ApplNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const appLoading = appSelectors.selectLoading();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('useEffect loadSuperDataFromDisc', user?.id);
    if (!user) {
      return;
    }
    dispatch(appActions.loadSuperDataFromDisc());
  }, [dispatch, user]);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return authLoading || loading || appLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary}>
        <></>
      </ActivityIndicator>
      <Caption style={styles.title}>{'Загрузка данных...'}</Caption>
    </AppScreen>
  ) : (
    <MobileApp items={navItems} />
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
