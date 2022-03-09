import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import ErrorBoundary from 'react-native-error-boundary';

import {
  appActions,
  appSelectors,
  authSelectors,
  refSelectors,
  settingsActions,
  useDispatch,
  useSelector,
} from '@lib/store';
import {
  AppScreen,
  globalStyles as styles,
  Theme as defaultTheme,
  Provider as UIProvider,
  AppFallback,
} from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { DocNavigator } from './src/navigation/DocNavigator';

import { store, useAppInventoryThunkDispatch, useSelector as useInvSelector, appInventoryActions } from './src/store';

import { IDepartment } from './src/store/types';
import { IGood, IRemains } from './src/store/app/types';
import { appSettings } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Doc',
        title: 'Приход',
        icon: 'file-document-outline',
        component: DocNavigator,
      },
    ],
    [],
  );

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const appInventoryDispatch = useAppInventoryThunkDispatch();

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const departments = refSelectors.selectByName<IDepartment>('department')?.data;
  const remains = refSelectors.selectByName<IRemains>('remain')?.data;
  const authLoading = useSelector((state) => state.auth.loadingData);
  const appDataLoading = appSelectors.selectLoading();
  const appLoading = useSelector((state) => state.app.loading);
  const isLogged = authSelectors.isLoggedWithCompany();
  const invLoading = useInvSelector((state) => state.appInventory.loading);

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  useEffect(() => {
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLogged) {
      dispatch(appActions.loadSuperDataFromDisc());
    }
  }, [dispatch, isLogged]);

  // useEffect(() => {
  //   const getRemainsModel = async () => {
  //     if (!goods?.length || !departments?.length || !isLogged) {
  //       return;
  //     }
  //     const model: IModelData<IMDGoodRemain> = departments?.reduce(
  //       (contsprev: IModelData<IMDGoodRemain>, c: IDepartment) => {
  //         const remGoods = goods?.reduce((goodsprev: IMGoodData<IMGoodRemain>, g: IGood) => {
  //           goodsprev[g.id] = {
  //             ...g,
  //             remains:
  //               remains
  //                 ?.find((r) => r.contactId === c.id)
  //                 ?.data?.filter((i) => i.goodId === g.id)
  //                 ?.map((r) => ({ price: r.price, q: r.q })) || [],
  //           };
  //           return goodsprev;
  //         }, {});
  //         contsprev[c.id] = { contactName: c.name, goods: remGoods };
  //         return contsprev;
  //       },
  //       {},
  //     );

  //     // console.log(
  //     //   'model',
  //     //   Object.entries(model).find(
  //     //     (item) => item[1].contactName === '"ПАЧАСТУНАК З ВАУКАВЫСКА" (г.Брест,ул.Пушкинская,1-63а)',
  //     //   ),
  //     // );
  //     await appInventoryDispatch(appInventoryActions.setModel(model));
  //   };

  //   getRemainsModel();
  // }, [appInventoryDispatch, departments, goods, remains, isLogged]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // const errorHandler = (error: Error, _stackTrace: string) => {
  //   console.log('errorHandler', error.message);
  // };

  const invLoadingError = useInvSelector<string>((state) => state.appInventory.loadingError);

  const onClearLoadingErrors = () => dispatch(appInventoryActions.setLoadingError(''));

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      {authLoading || loading || appLoading || invLoading || appDataLoading ? (
        <AppScreen>
          <ActivityIndicator size="large" color={colors.primary} />
          <Caption style={styles.title}>
            {appDataLoading || invLoading
              ? 'Загрузка данных...'
              : appLoading
              ? 'Синхронизация данных..'
              : 'Пожалуйста, подождите..'}
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
    </UIProvider>
  </Provider>
);

export default App;
