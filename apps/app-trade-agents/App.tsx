import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { IReference, ISettingsOption, Settings } from '@lib/types';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';

import { Caption } from 'react-native-paper';

import { globalStyles as styles } from '@lib/mobile-ui';

import { persistor, store } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import config from './src/config';
import { IContact, IGood, INetPrice, IModel, IGoodGroup } from './src/store/types';
import actions, { useAppTradeThunkDispatch } from './src/store/app-trade';
import { IGroupModel, IParentGroupModel } from './src/store/app-trade/types';

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

  const appSettings: Settings = {
    isUseNetPrice: {
      id: '5',
      description: 'Использовать матрицы',
      data: true,
      type: 'boolean',
      sortOrder: 3,
      visible: true,
    },
    serverName: {
      id: '6',
      sortOrder: 5,
      description: 'Бэк-офис. Адрес сервера',
      data: config.BACK_URL,
      type: 'string',
      visible: true,
    },
    serverPort: {
      id: '7',
      description: 'Бэк-офис. Порт сервера',
      data: config.BACK_PORT,
      type: 'number',
      sortOrder: 6,
      visible: true,
    },
    returnDocTime: {
      id: '8',
      description: 'Время поиска накладных возврата, дн',
      data: 30,
      type: 'number',
      sortOrder: 7,
      visible: true,
    },
  };

  const storeSettings = useSelector((state) => state.settings);

  const dispatch = useDispatch();
  const appTradeDispatch = useAppTradeThunkDispatch();

  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = storeSettings.data[optionName];
        if (!storeSet && value) {
          dispatch(settingsActions.addSetting({ optionName, value }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSettings]);

  const { data: settings } = useSelector((state) => state.settings);
  const isUseNetPrice = (settings?.isUseNetPrice as ISettingsOption<boolean>)?.data;

  const groups = (refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>)?.data;
  const goods = (refSelectors.selectByName('good') as IReference<IGood>)?.data;
  const departments = (refSelectors.selectByName('department') as IReference<IContact>)?.data;
  const netPrice = (refSelectors.selectByName('netPrice') as IReference<INetPrice>)?.data;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect setModel');
    setLoading(true);
    const setModel = async () => {
      if (!!goods?.length && !!departments?.length) {
        const refGoods = groups
          .filter((gr) => gr.parent !== undefined)
          ?.reduce((prev: IParentGroupModel, cur: IGoodGroup) => {
            if (!cur.parent) {
              return prev;
            }

            const goodList = goods.filter((g) => g.goodgroup.id === cur.id);
            const groupsModel = prev[cur.parent.id];

            const newGroupsModel: IGroupModel = { ...groupsModel, [cur.id]: goodList };

            return { ...prev, [cur.parent.id]: newGroupsModel };
          }, {});

        const model: IModel = departments.reduce((oPrev: IModel, oCur: IContact) => {
          const netContact = netPrice.filter((n) => n.contactId === oCur.id);
          const parentGroupList: IParentGroupModel =
            netContact.length > 0 && isUseNetPrice
              ? netContact.reduce((prev: IParentGroupModel, cur: INetPrice) => {
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
                    pricefsn: cur.pricefsn,
                    pricefso: cur.pricefso,
                    priceFsnSklad: cur.priceFsnSklad,
                    priceFsoSklad: cur.priceFsoSklad,
                  } as IGood;

                  const groupsModel = prev[group.parent.id];

                  const goodList =
                    groupsModel && groupsModel[group.id]
                      ? [...groupsModel[group.id].filter((i) => i.id !== good.id), newGood]
                      : [newGood];

                  const newGroupsModel: IGroupModel = { ...groupsModel, [group.id]: goodList };

                  return { ...prev, [group.parent.id]: newGroupsModel };
                }, {})
              : refGoods;
          return { ...oPrev, [oCur.id]: parentGroupList };
        }, {});
        await appTradeDispatch(actions.setModel(model));
      }
    };
    setModel();
    setLoading(false);
  }, [appTradeDispatch, contacts, goods, groups, netPrice, isUseNetPrice]);

  return loading ? (
    <Caption style={styles.text}>{loading ? 'Формирование данных...' : ''}</Caption>
  ) : (
    <MobileApp items={navItems} />
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);

export default App;
