/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { IReference, Settings } from '@lib/types';
import { PersistGate } from 'redux-persist/integration/react';
import { refSelectors, settingsActions, useDispatch, useSelector, useDispatch as useDocDispatch } from '@lib/store';
import { globalStyles as styles } from '@lib/mobile-ui';

import { Caption } from 'react-native-paper';

import { persistor, store } from './src/store';

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
import { InventoryNavigator } from './src/navigation/InventoryNavigator';
import { appSettings } from './src/utils/constants';

const Root = () => {
  //const newDispatch = useDocDispatch();
  //newDispatch(settingsActions.init());

  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Inventorys',
        title: 'Инвентаризации',
        icon: 'file-document-outline',
        component: InventoryNavigator,
      },
    ],
    [],
  );

  const storeSettings = useSelector((state) => state.settings)?.data;
  const dispatch = useDispatch();
  const appInventoryDispatch = useAppInventoryThunkDispatch();

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      await appInventoryDispatch(actions.setModel(model));
    };
    getRemainsModel();
    setLoading(false);
  }, [appInventoryDispatch, departments, goods, remains]);
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
