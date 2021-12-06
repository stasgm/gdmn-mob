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
import { InventorysNavigator } from './src/navigation/InventorysNavigator';

import { IContact, IGood, IRemains, IMDGoodRemain, IMGoodData, IMGoodRemain, IModelData } from './src/store/types';
import actions, { useAppInventoryThunkDispatch } from './src/store/app';

const Root = () => {
  const navItems: INavItem[] = useMemo(
    () => [
      {
        name: 'Inventorys',
        title: 'Инвентаризации',
        icon: 'file-document-outline',
        component: InventorysNavigator,
      },
    ],
    [],
  );

  const appSettings: Settings = {
    scannerUse: {
      id: '3',
      sortOrder: 3,
      description: 'Использовать сканер',
      data: true,
      type: 'boolean',
      visible: true,
    },
  };
  ////
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSettings]);

  const goods = (refSelectors.selectByName('good') as IReference<IGood>)?.data;
  const contacts = (refSelectors.selectByName('contact') as IReference<IContact>)?.data;
  const remains = (refSelectors.selectByName('remain') as IReference<IRemains>)?.data;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect setModel');
    setLoading(true);
    const getRemainsModel = async () => {
      const model: IModelData<IMDGoodRemain> = contacts?.reduce((contsprev: IModelData<IMDGoodRemain>, c: IContact) => {
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
      }, {});
      await appInventoryDispatch(actions.setModel(model));
    };
    getRemainsModel();
    setLoading(false);
  }, [appInventoryDispatch, contacts, goods, remains]);
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
