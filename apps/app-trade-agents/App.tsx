import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { IReference, Settings } from '@lib/types';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';

import { persistor, store, useSelector as useAppTradeSelector } from './src/store';
import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import { IContact, IGood, INetPrice, IModel } from './src/store/types';
import actions, { useAppTradeThunkDispatch } from './src/store/app-trade';

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

  // const groups = (refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>)?.data;
  const goods = (refSelectors.selectByName('good') as IReference<IGood>)?.data;
  const contacts = (refSelectors.selectByName('contact') as IReference<IContact>)?.data;
  const netPrice = (refSelectors.selectByName('netPrice') as IReference<INetPrice>)?.data;

  // console.log('model', model);

  useEffect(() => {
    console.log('useEffect');
    if (goods.length > 0 && contacts.length > 0) {
      const model: IModel = contacts.reduce((oPrev: IModel, oCur: IContact) => {
        const goodList: IGood[] = netPrice
          ? netPrice.reduce((prev: IGood[], cur: INetPrice) => {
              const good = goods.find((g) => g.id === cur.good.id);
              if (good) {
                // return [good];
                const newGood = {
                  ...good,
                  pricefsn: cur.pricefsn,
                  pricefso: cur.pricefso,
                  priceFsnSklad: cur.priceFsnSklad,
                  priceFsoSklad: cur.priceFsoSklad,
                } as IGood;
                return [...prev.filter((i) => i.id !== good.id), newGood];
              } else {
                return prev;
              }
            }, [])
          : goods;
        return { ...oPrev, [oCur.id]: goodList };
      }, {});
      appTradeDispatch(actions.setModel(model));
      // console.log('model', model);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // <MobileApp store={store} items={navItems} /> - если не нужен доступ к Store извне
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
