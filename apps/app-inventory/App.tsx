/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { IReference, Settings } from '@lib/types';
import { PersistGate } from 'redux-persist/integration/react';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles } from '@lib/mobile-ui';

import { Caption } from 'react-native-paper';

import { persistor, store } from './src/store';
import { InventoryNavigator } from './src/navigation/InventoryNavigator';

import {
  IContact,
  IGood,
  IRemains,
  IMDGoodRemain,
  IMGoodData,
  IMGoodRemain,
  IModelData,
  IDepartment,
} from './src/store/types';
import actions, { useAppInventoryThunkDispatch } from './src/store/app';

import { metaData, inv } from './src/utils/constants';

const Root = () => {
  //const newDispatch = useDocDispatch();
  //newDispatch(settingsActions.init());
  // const navItems: INavItem[] = useMemo(
  //   () => [
  //     {
  //       name: 'Inventorys',
  //       title: 'Инвентаризации',
  //       icon: 'file-document-outline',
  //       component: InventoryNavigator,
  //     },
  //     {
  //       name: 'Prihod',
  //       title: 'Инвентаризации1',
  //       icon: 'file-document-outline',
  //       component: InventoryNavigator,
  //     },
  //   ],
  //   [],
  // );

  const navItems: INavItem[] = useMemo(() => inv, []);

  const appSettings: Settings = {
    scannerUse: {
      id: '4',
      sortOrder: 4,
      description: 'Использовать сканер',
      data: true,
      type: 'boolean',
      visible: true,
      group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
    },
    weightCode: {
      id: '5',
      sortOrder: 5,
      description: 'Идентификатор весового товара',
      data: '22',
      type: 'string',
      visible: true,
      group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
    },
    countCode: {
      id: '6',
      sortOrder: 6,
      description: 'Количество символов для кода товара',
      data: 5,
      type: 'number',
      visible: true,
      group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
    },
    countWeight: {
      id: '7',
      sortOrder: 7,
      description: 'Количество символов для веса (в гр.)',
      data: 5,
      type: 'number',
      visible: true,
      group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
    },
  };

  const storeSettings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const appInventoryDispatch = useAppInventoryThunkDispatch();

  useEffect(() => {
    if (appSettings) {
      Object.entries(appSettings).forEach(([optionName, value]) => {
        const storeSet = storeSettings.data[optionName];
        if (!storeSet && value) {
          dispatch(settingsActions.addSetting({ optionName, value }));
        }
      });
    }
  }, [storeSettings]);

  // const goods = (refSelectors.selectByName('good') as IReference<IGood>)?.data;
  const good = refSelectors.selectByName<IGood>('good')?.data;
  const departments = (refSelectors.selectByName('department') as IReference<IContact>)?.data;
  const remains = (refSelectors.selectByName('remain') as IReference<IRemains>)?.data;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getRemainsModel = async () => {
      const model: IModelData<IMDGoodRemain> = departments?.reduce(
        (contsprev: IModelData<IMDGoodRemain>, c: IDepartment) => {
          const remGoods = good?.reduce((goodsprev: IMGoodData<IMGoodRemain>, g: IGood) => {
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
      await appInventoryDispatch(actions.setModel(model));
    };
    getRemainsModel();
    setLoading(false);
  }, [appInventoryDispatch, departments, good, remains]);
  return loading ? (
    <Caption style={styles.text}>{loading ? 'Формирование данных...' : ''}</Caption>
  ) : (
    <MobileApp items={navItems} />
  );
};

export const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);
