import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { IReference, Settings } from '@lib/types';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';

import { View, StyleSheet } from 'react-native';

import { Caption } from 'react-native-paper';

import { globalStyles as styles } from '@lib/mobile-ui';

import { persistor, store } from './src/store';
import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
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
    serverName: {
      id: '4',
      sortOrder: 4,
      description: 'Бэк-офис. Адрес сервера',
      data: 'http://192.168.0.70',
      type: 'string',
      visible: true,
    },
    serverPort: {
      id: '5',
      description: 'Бэк-офис. Порт сервера',
      data: '8000',
      type: 'string',
      sortOrder: 5,
      visible: true,
    },
    // timeout: {
    //   id: '6',
    //   description: 'Бэк-офис. Время ожидания, мс',
    //   data: 10000,
    //   type: 'number',
    //   sortOrder: 6,
    //   visible: true,
    // },
    returnDocTime: {
      id: '6',
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

  const groups = (refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>)?.data;
  const goods = (refSelectors.selectByName('good') as IReference<IGood>)?.data;
  const contacts = (refSelectors.selectByName('contact') as IReference<IContact>)?.data;
  const netPrice = (refSelectors.selectByName('netPrice') as IReference<INetPrice>)?.data;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    setLoading(true);
    const setModel = async () => {
      if (goods.length > 0 && contacts.length > 0) {
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

        const model: IModel = contacts.reduce((oPrev: IModel, oCur: IContact) => {
          const netContact = netPrice.filter((n) => n.contact.id === oCur.id);
          const parentGroupList: IParentGroupModel =
            netContact.length > 0
              ? netContact.reduce((prev: IParentGroupModel, cur: INetPrice) => {
                  const good = goods.find((g) => g.id === cur.good.id);
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
  }, [appTradeDispatch, contacts, goods, groups, netPrice]);

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

// const styles = StyleSheet.create({
//   caption: {
//     textAlign: 'center',
//     fontSize: 14,
//     lineHeight: 14,
//   },
// });

export default App;
