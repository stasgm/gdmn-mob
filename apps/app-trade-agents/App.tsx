import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import {
  appActions,
  appSelectors,
  authSelectors,
  refSelectors,
  settingsActions,
  useDispatch,
  useSelector,
} from '@lib/store';

import { globalStyles as styles, AppScreen, Theme as defaultTheme, Provider as UIProvider } from '@lib/mobile-ui';

import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

import { ISettingsOption } from '@lib/types';

import { appTradeActions, store, useAppTradeThunkDispatch, useSelector as useAppTradeSelector } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import GoodMatrixNavigator from './src/navigation/Root/GoodMatrixNavigator';

import { IContact, IGood, IGoodMatrix, IGoodGroup, IMatrixData } from './src/store/types';
import { IGoodModel, IMGoodData, IMGroupData, IModelData, IMParentGroupData } from './src/store/app/types';
import { appSettings } from './src/utils/constants';

const Root = () => {
  const navItems: INavItem[] = [
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
      name: 'ReturnsNav',
      title: 'Возвраты',
      icon: 'file-restore',
      component: ReturnsNavigator,
    },
    {
      name: 'MapNav',
      title: 'Карта',
      icon: 'map-outline',
      component: MapNavigator,
    },
    {
      name: 'GoodMatrixNav',
      title: 'Матрицы',
      icon: 'tag-text-outline',
      component: GoodMatrixNavigator,
    },
  ];

  const dispatch = useDispatch();
  const appDispatch = useAppTradeThunkDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    // console.log('useEffect loadGlobalDataFromDisc');
    // dispatch(authActions.init());
    dispatch(appActions.loadGlobalDataFromDisc());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Загружаем в стор дополнительные настройки приложения
  const isInit = useSelector((state) => state.settings.isInit);
  const settings = useSelector((state) => state.settings?.data);

  useEffect(() => {
    if (appSettings && isInit) {
      dispatch(settingsActions.addSettings(appSettings));
      dispatch(
        settingsActions.updateOption({
          optionName: 'getReferences',
          value: { ...settings.getReferences, data: false } as ISettingsOption,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data);
  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const contacts = refSelectors.selectByName<IContact>('contact')?.data;
  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data;
  const appDataLoading = appSelectors.selectLoading();
  const appLoading = useSelector((state) => state.app.loading);
  const authLoading = useSelector((state) => state.auth.loadingData);
  const tradeLoading = useAppTradeSelector((state) => state.appTrade.loadingData);
  const isLogged = authSelectors.isLoggedWithCompany();

  useEffect(() => {
    if (isLogged) {
      // console.log('useEffect loadSuperDataFromDisc', isLogged);
      dispatch(appActions.loadSuperDataFromDisc());
    }
  }, [dispatch, isLogged]);

  useEffect(() => {
    const setModel = async () => {
      if (!goods?.length || !contacts?.length || !groups.length || !isLogged) {
        return;
      }
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

        //Если стоит признак Использовать матрицы, то берем дату и данные по товарам из матриц
        //(если в матрицах нет товаров по клиенту, то возвращаем пустой набор данных)
        //Если не стоит признак Использовать матрицы, то берем текущую дату, а данные по товарам из справочника тмц
        const onDate = isUseNetPrice && matrixContact?.onDate ? new Date(matrixContact?.onDate) : new Date();

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
    };
    setModel();
  }, [contacts, goods, groups, isUseNetPrice, appDispatch, goodMatrix, isLogged]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Для отрисовки при первом подключении
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return authLoading || loading || appLoading || tradeLoading || appDataLoading ? (
    <AppScreen>
      <ActivityIndicator size="large" color={colors.primary} />
      <Caption style={styles.title}>
        {appDataLoading || tradeLoading
          ? 'Загрузка данных...'
          : appLoading
          ? 'Синхронизация данных..'
          : 'Пожалуйста, подождите..'}
      </Caption>
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
