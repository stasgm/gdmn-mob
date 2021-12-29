import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import {
  appActions,
  appSelectors,
  authActions,
  documentActions,
  referenceActions,
  refSelectors,
  settingsActions,
  useDispatch,
  useSelector,
} from '@lib/store';

import { globalStyles as styles, AppScreen, Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { appTradeActions, store, useAppTradeThunkDispatch, useSelector as useAppTradeSelector } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import { IContact, IGood, IGoodMatrix, IGoodGroup, IMatrixData } from './src/store/types';
import { IGoodModel, IMGoodData, IMGroupData, IModelData, IMParentGroupData } from './src/store/app/types';
import { appSettings } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = [
    /*   {
      name: 'Dashboard',
      title: 'Дашборд',
      icon: 'view-dashboard-outline',
      component: DashboardNavigator,
    }, */
    {
      name: 'Routes',
      title: 'Маршруты',
      icon: 'routes',
      component: RoutesNavigator,
    },
    {
      name: 'Orders',
      title: 'Заявки',
      icon: 'clipboard-list-outline',
      component: OrdersNavigator,
    },
    {
      name: 'Returns',
      title: 'Возвраты',
      icon: 'file-restore',
      component: ReturnsNavigator,
    },
    {
      name: 'Map',
      title: 'Карта',
      icon: 'map-outline',
      component: MapNavigator,
    },
  ];

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const appDispatch = useAppTradeThunkDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(documentActions.init());
    // dispatch(appTradeActions.init());
    // dispatch(referenceActions.init());
    // dispatch(settingsActions.init());
    // dispatch(authActions.init());
    // saveDataToDisk('documents', store.getState().documents, '5ae8c930-0584-11ec-991a-779431d580c9');
    dispatch(appActions.loadGlobalDataFromDisc());
    // setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (user?.id) {
  //     console.log('useEffect loadSuperDataFromDisc', user.id);
  //     dispatch(appActions.loadSuperDataFromDisc());
  //   }
  //   setLoading(false);
  //   // dispatch(documentActions.init());
  //   // dispatch(appTradeActions.init());
  //   // dispatch(referenceActions.init());
  //   // dispatch(settingsActions.init());
  //   // dispatch(authActions.init());
  // }, [dispatch, user?.id]);

  //Загружаем в сторе дополнительные настройки приложения
  const baseSettings = useSelector((state) => state.settings?.data) || {};
  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = baseSettings[optionName];
        if (!storeSet && value) {
          dispatch(settingsActions.addOption({ optionName, value }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSettings]);

  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data);
  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const contacts = refSelectors.selectByName<IContact>('contact')?.data;
  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data;
  const appLoading = appSelectors.selectLoading();
  const authLoading = useSelector((state) => state.auth.loading);
  const tradeLoading = useAppTradeSelector((state) => state.appTrade.loading);
  const connectionStatus = useSelector((state) => state.auth.connectionStatus);

  useEffect(() => {
    console.log('useEffect user', loading, user?.id);
    if (user?.id) {
      console.log('useEffect loadSuperDataFromDisc', user.id);
      dispatch(appActions.loadSuperDataFromDisc());
      // setLoading(false);
    }
    setLoading(false);
    // setLoading(!user?.id);
    // dispatch(documentActions.init());
    // dispatch(appTradeActions.init());
    // dispatch(referenceActions.init());
    // dispatch(settingsActions.init());
    // dispatch(authActions.init());
  }, [user?.id]);

  const [goodModelLoading, setGoodModelLoading] = useState(false);

  useEffect(() => {
    const setModel = async () => {
      if (!goods?.length || !contacts?.length || !groups.length) {
        return;
      }
      setGoodModelLoading(true);
      const refGoods = groups
        .filter((gr) => gr.parent !== undefined)
        ?.reduce((prev: IMParentGroupData<IMGroupData<IMGoodData<IGood>>>, cur: IGoodGroup) => {
          if (!cur.parent) {
            return prev;
          }
          const goodList = goods
            .filter((g) => g.goodgroup.id === cur.id)
            .reduce((gPrev: IMGoodData<IGood>, gCur: IGood) => {
              gPrev[gCur.id] = gCur;
              return gPrev;
            }, {});

          const gr = prev[cur.parent.id] || {};
          gr[cur.id] = goodList;
          prev[cur.parent.id] = gr;
          return prev;
        }, {});

      const goodModel: IModelData<IGoodModel> = contacts.reduce((oPrev: IModelData<IGoodModel>, oCur: IContact) => {
        const matrixContact = goodMatrix?.find((n) => n.contactId === oCur.id);
        const onDate = matrixContact?.onDate ? new Date(matrixContact?.onDate) : new Date();
        const parentGroupList: IMParentGroupData<IMGroupData<IMGoodData<IGood>>> =
          matrixContact?.data && matrixContact.data.length && isUseNetPrice
            ? matrixContact.data.reduce((prev: IMParentGroupData<IMGroupData<IMGoodData<IGood>>>, cur: IMatrixData) => {
                const good = goods.find((g) => g.id === cur.goodId);
                if (!good) {
                  return prev;
                }

                const group = groups.find((gr) => gr.id === good.goodgroup.id);
                if (!group) {
                  return prev;
                }
                //Если есть родитель, то возьмем все группы из родителя,
                //иначе эта группа первого уровня, здесь не должно быть таких
                if (!group.parent) {
                  return prev;
                }

                const newGood = {
                  ...good,
                  priceFsn: cur.priceFsn,
                  priceFso: cur.priceFso,
                  priceFsnSklad: cur.priceFsnSklad,
                  priceFsoSklad: cur.priceFsoSklad,
                } as IGood;

                const newParentGroup = prev[group.parent.id] || {};
                const newGroup = newParentGroup[group.id] || {};
                newParentGroup[group.id] = { ...newGroup, [good.id]: newGood };
                return { ...prev, [group.parent.id]: newParentGroup };
              }, {})
            : refGoods;

        oPrev[oCur.id] = { contactName: oCur.name, onDate, goods: parentGroupList };
        return oPrev;
      }, {});

      await appDispatch(appTradeActions.setGoodModel(goodModel));
      setGoodModelLoading(false);
    };
    setModel();
  }, [contacts, goods, groups, isUseNetPrice, appDispatch, goodMatrix]);

  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   console.log('loading appLoading', appLoading, loading);
  //   if (!appLoading) {
  //     setLoading(appLoading);
  //   }
  // }, [appLoading]);

  console.log('loading', loading);
  console.log('authLoading', authLoading);
  console.log('appLoading', appLoading);
  console.log('tradeLoading', tradeLoading);

  // useEffect(() => {
  //   //Для отрисовки при первом подключении
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);
  //goodModelLoading loading

  return authLoading || loading || appLoading || tradeLoading ? (
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
