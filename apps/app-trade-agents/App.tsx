import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MobileApp } from '@lib/mobile-app';
import { INavItem } from '@lib/mobile-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { IReference, ISettingsOption, Settings } from '@lib/types';
import { refSelectors, settingsActions, useDispatch, useSelector } from '@lib/store';

import { Caption } from 'react-native-paper';

import { globalStyles as styles } from '@lib/mobile-ui';

import { persistor, store, useAppTradeThunkDispatch, appTradeActions } from './src/store';

import RoutesNavigator from './src/navigation/Root/RoutesNavigator';
import OrdersNavigator from './src/navigation/Root/OrdersNavigator';
import ReturnsNavigator from './src/navigation/Root/ReturnsNavigator';
import MapNavigator from './src/navigation/Root/Maps/MapNavigator';
import GoodMatrixNavigator from './src/navigation/Root/GoodMatrixNavigator';

import config from './src/config';
import { IContact, IGood, IGoodMatrix, IGoodGroup, IMatrixData } from './src/store/types';
import { IGoodModel, IMGoodData, IMGroupData, IModelData, IMParentGroupData } from './src/store/app/types';

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
    {
      name: 'GoodMatrix',
      title: 'Матрицы',
      icon: 'map-outline',
      component: GoodMatrixNavigator,
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
      group: { id: '2', name: 'Настройки заявок и возвратов', sortOrder: 2 },
    },
    serverName: {
      id: '6',
      sortOrder: 5,
      description: 'Бэк-офис. Адрес сервера',
      data: config.BACK_URL,
      type: 'string',
      visible: true,
      group: { id: '2', name: 'Настройки заявок и возвратов', sortOrder: 2 },
    },
    serverPort: {
      id: '7',
      description: 'Бэк-офис. Порт сервера',
      data: config.BACK_PORT,
      type: 'number',
      sortOrder: 6,
      visible: true,
      group: { id: '2', name: 'Настройки заявок и возвратов', sortOrder: 2 },
    },
    returnDocTime: {
      id: '8',
      description: 'Время поиска накладных возврата, дн',
      data: 30,
      type: 'number',
      sortOrder: 7,
      visible: true,
      group: { id: '2', name: 'Настройки заявок и возвратов', sortOrder: 2 },
    },
  };

  const storeSettings = useSelector((state) => state.settings);

  const dispatch = useDispatch();
  const appDispatch = useAppTradeThunkDispatch();

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
  const contacts = (refSelectors.selectByName('contact') as IReference<IContact>)?.data;
  const goodMatrix = (refSelectors.selectByName('goodMatrix') as IReference<IGoodMatrix>)?.data;

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);

  //   const createGoodModel = async () => {
  //     console.log('createModel');
  //     if (!goods?.length || !contacts?.length || !groups.length) {
  //       return;
  //     }
  //     console.log('createModel 2');
  //     const parentGroups = groups.filter((gr) => !gr.parent);
  //     const today = new Date();

  //     const goodModel: IModelData<IGoodModel> = contacts?.reduce(
  //       (contactPrev: IModelData<IGoodModel>, contact: IContact) => {
  //         const parentGroupList = parentGroups.reduce(
  //           (parentGrPrev: IMParentGroupData<IMGroupData<IMGoodData<IMGood>>>, parentGr: IGoodGroup) => {
  //             const groupList = groups.filter((gr) => gr.parent?.id === parentGr.id);
  //             const goodList = groupList.reduce((groupPrev: IMGroupData<IMGoodData<IMGood>>, group: IGoodGroup) => {
  //               const list = goods
  //                 .filter((g) => g.goodgroup.id === group.id)
  //                 .reduce((goodPrev: IMGoodData<IMGood>, good: IGood) => {
  //                   //Оставляем поля, которые нам нужны для модели с товаром
  //                   const { id, goodgroup, creationDate, editionDate, ...goodRest } = good;
  //                   //Если в настройках установлен параметр Использовать матрицы
  //                   if (isUseNetPrice) {
  //                     //Находим в матрице запись по контакту и товару
  //                     const matrix = goodMatrix
  //                       .find((m) => m.contactId === contact.id)
  //                       ?.data?.find((i) => i.goodId === good.id);
  //                     //Если матрица есть, в модель товара подставляем признаки из матрицы,
  //                     //иначе товар не будет добавлен в модель
  //                     if (matrix) {
  //                       const { goodId, ...rest } = matrix;
  //                       goodPrev[good.id] = { ...goodRest, ...rest };
  //                     }
  //                   } else {
  //                     //Добавляем товар в модель с признаками из справочника товаров
  //                     goodPrev[good.id] = { ...goodRest };
  //                   }
  //                   return goodPrev;
  //                 }, {});

  //               groupPrev[group.id] = list;
  //               return groupPrev;
  //             }, {});

  //             parentGrPrev[parentGr.id] = goodList;
  //             return parentGrPrev;
  //           },
  //           {},
  //         );

  //         contactPrev[contact.id] = { contactName: contact.name, onDate: today, goods: parentGroupList };
  //         return contactPrev;
  //       },
  //       {},
  //     );
  //     console.log('goodModel is created');
  //     appDispatch(appTradeActions.setGoodModel(goodModel));
  //   };

  //   createGoodModel();
  //   setLoading(false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [contacts, goods, groups, goodMatrix, isUseNetPrice]);

  useEffect(() => {
    console.log('useEffect setModel');
    setLoading(true);
    const setModel = async () => {
      if (!goods?.length || !contacts?.length || !groups.length) {
        return;
      }
      // const today = new Date();
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
    };
    setModel();
    setLoading(false);
  }, [contacts, goods, groups, isUseNetPrice, appDispatch, goodMatrix]);

  // useEffect(() => {
  //   console.log('useEffect setModel');
  //   setLoading(true);
  //   const setModel = async () => {
  //     if (!!goods?.length && !!contacts?.length) {
  //       const refGoods = groups
  //         .filter((gr) => gr.parent !== undefined)
  //         ?.reduce((prev: IParentGroupModel, cur: IGoodGroup) => {
  //           if (!cur.parent) {
  //             return prev;
  //           }

  //           const goodList = goods.filter((g) => g.goodgroup.id === cur.id);
  //           const groupsModel = prev[cur.parent.id];

  //           const newGroupsModel: IGroupModel = { ...groupsModel, [cur.id]: goodList };

  //           return { ...prev, [cur.parent.id]: newGroupsModel };
  //         }, {});

  //       const goodModel: IModel = contacts.reduce((oPrev: IModel, oCur: IContact) => {
  //         const netContact = netPrice.filter((n) => n.contactId === oCur.id);
  //         const parentGroupList: IParentGroupModel =
  //           netContact.length > 0 && isUseNetPrice
  //             ? netContact.reduce((prev: IParentGroupModel, cur: INetPrice) => {
  //                 const good = goods.find((g) => g.id === cur.goodId);
  //                 if (!good) {
  //                   return prev;
  //                 }

  //                 const group = groups.find((gr) => gr.id === good.goodgroup.id);
  //                 if (!group) {
  //                   return prev;
  //                 }
  //                 //Если есть родитель, то возьмем все группы из родителя,
  //                 //иначе эта группа первого уровня, здесь не должно быть таких
  //                 if (!group.parent) {
  //                   return prev;
  //                 }

  //                 const newGood = {
  //                   ...good,
  //                   pricefsn: cur.pricefsn,
  //                   pricefso: cur.pricefso,
  //                   priceFsnSklad: cur.priceFsnSklad,
  //                   priceFsoSklad: cur.priceFsoSklad,
  //                 } as IGood;

  //                 const groupsModel = prev[group.parent.id];

  //                 const goodList =
  //                   groupsModel && groupsModel[group.id]
  //                     ? [...groupsModel[group.id].filter((i) => i.id !== good.id), newGood]
  //                     : [newGood];

  //                 const newGroupsModel: IGroupModel = { ...groupsModel, [group.id]: goodList };

  //                 return { ...prev, [group.parent.id]: newGroupsModel };
  //               }, {})
  //             : refGoods;
  //         return { ...oPrev, [oCur.id]: parentGroupList };
  //       }, {});
  //       await appDispatch(appTradeActions.setGoodModel(goodModel));
  //     }
  //   };
  //   setModel();
  //   setLoading(false);
  // }, [appTradeDispatch, contacts, goods, groups, netPrice, isUseNetPrice]);

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
