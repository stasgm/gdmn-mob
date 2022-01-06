/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';

import { appActions, appSelectors, refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';
import { AppScreen, globalStyles as styles, Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { InventoryNavigator } from './src/navigation/InventoryNavigator';

import { store, useAppInventoryThunkDispatch, useSelector as useInvSelector, appInventoryActions } from './src/store';

import { IContact, IDepartment, IGood, IRemains } from './src/store/types';
import { IMDGoodRemain, IMGoodData, IMGoodRemain, IModelData } from './src/store/app/types';
import { appSettings } from './src/utils/constants';

const Root = () => {
  //const newDispatch = useDocDispatch();
  //newDispatch(settingsActions.init());

  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Inventory',
        title: 'Инвентаризация',
        icon: 'file-document-outline',
        component: InventoryNavigator,
      },
    ],
    [],
  );

  const storeSettings = useSelector((state) => state.settings?.data);
  const dispatch = useDispatch();
  const appInventoryDispatch = useAppInventoryThunkDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = storeSettings[optionName];
        if (!storeSet && value) {
          dispatch(settingsActions.addOption({ optionName, value }));
        }
      });
    }
  }, [storeSettings]);

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const departments = refSelectors.selectByName<IContact>('contact')?.data;
  const remains = refSelectors.selectByName<IRemains>('remain')?.data;
  const user = useSelector((state) => state.auth.user);
  const appLoading = appSelectors.selectLoading();
  const authLoading = useSelector((state) => state.auth.loading);
  const invLoading = useInvSelector((state) => state.appInventory.loading);

  useEffect(() => {
    console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      console.log('useEffect loadSuperDataFromDisc', user.id);
      dispatch(appActions.loadSuperDataFromDisc());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const getRemainsModel = async () => {
      const model: IModelData<IMDGoodRemain> = departments?.reduce(
        (contsprev: IModelData<IMDGoodRemain>, c: IDepartment) => {
          const remGoods = goods?.reduce((goodsprev: IMGoodData<IMGoodRemain>, g: IGood) => {
            goodsprev[g.id] = {
              ...g,
              remains:
                remains
                  ?.find((r) => r.contactId === c.id)
                  ?.data?.filter((i) => i.goodId === g.id)
                  ?.map((r) => ({ price: r.price, q: r.q })) || [],
            };
            return goodsprev;
          }, {});
          contsprev[c.id] = { contactName: c.name, goods: remGoods };
          return contsprev;
        },
        {},
      );
      await appInventoryDispatch(appInventoryActions.setModel(model));
    };
    getRemainsModel();
  }, [appInventoryDispatch, departments, goods, remains]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // console.log('111', authLoading || loading || appLoading || invLoading);

  return authLoading || loading || appLoading || invLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary} />
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
