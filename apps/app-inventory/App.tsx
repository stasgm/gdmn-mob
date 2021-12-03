import React, { useMemo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { IReference, Settings } from '@lib/types';
import { PersistGate } from 'redux-persist/integration/react';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';

import { persistor, store } from './src/store';
import { InventorysNavigator } from './src/navigation/InventorysNavigator';

import {
  IContact,
  IGood,
  IRemains,
  IMDGoodRemain,
  IMGoodData,
  IMGoodRemain,
  IModel,
  IModelData,
  IGoodGroup,
  IRemainsData,
} from './src/store/types';
import actions, { useAppInventoryThunkDispatch } from './src/store/app-inv';
import { IGroupModel, IParentGroupModel } from './src/store/app-inv/types';

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
  const remains = (refSelectors.selectByName('remains') as IReference<IRemains>)?.data;
  const groups = (refSelectors.selectByName('goodGroup') as IReference<IGoodGroup>)?.data;

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);

  // const setModel = async () => {
  //   // if (!!goods?.length && !!contacts?.length) {
  //   const remModelData: IModelData<IMDGoodRemain> = contacts?.reduce(
  //     (contsprev: IModelData<IMDGoodRemain>, c: IContact) => {
  //       const remGoods = goods?.reduce((goodsprev: IMGoodData<IMGoodRemain>, g: IGood) => {
  //         goodsprev[g.id] = {
  //           ...g,
  //           remains:
  //             remains
  //               ?.find((r) => r.contactId === c.id)
  //               ?.data?.filter((i) => i.goodId === g.id)
  //               ?.map((r) => ({ price: r.price, q: r.q })) || [],
  //         };
  //         return goodsprev;
  //       }, {});
  //       contsprev[c.id] = { contactName: c.name, goods: remGoods };
  //       return contsprev;
  //     },
  //     {},
  //   );
  //   // }
  //   return remModelData;
  // };
  // // }, [goods, contacts, remains]);

  useEffect(() => {
    console.log('useEffect setModel');
    setLoading(true);
    const setModel = async () => {
      if (!!goods?.length && !!contacts?.length) {
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
          const netContact = remains.filter((n) => n.contactId === oCur.id);
          const parentGroupList: IParentGroupModel =
            netContact.length > 0 // && isUseNetPrice
              ? netContact.reduce((prev: IParentGroupModel, cur: IRemainsData) => {
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
                    pricefsn: cur.price,
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
        await appInventoryDispatch(actions.setModel(model));
      }
    };
    setModel();
    setLoading(false);
  }, [appInventoryDispatch, contacts, goods, groups, remains]);

  return <MobileApp items={navItems} />;
};

export const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);
