import React, { useState /*, { useCallback, useEffect, useMemo, useState }*/ } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MediumText, SelectableInput } from '@lib/mobile-ui';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { reducers } from './src/store';

// import { Provider } from 'react-redux';

// import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

// import {
//   /*globalStyles as styles, */ Theme as defaultTheme,
//   Provider as UIProvider /*, AppScreen*/,
// } from '@lib/mobile-ui';
// import { NavigationContainer } from '@react-navigation/native';

// import { store } from './src/store';

// import ApplNavigator from './src/navigation/Root/ApplNavigator';
// import { store } from './src/store';

// import { messageRequest, ONE_SECOND_IN_MS } from './src/utils/constants';

const AppOne = () => {
  const [val, setVal] = useState(false);
  return (
    <View style={styles.container}>
      <MediumText>Open up App.js to start working on your app!</MediumText>
      <StatusBar style="auto" />
      <SelectableInput
        label="Организация"
        placeholder="Выберите покупателя..."
        value={val ? 'Отгрузка' : 'Склад'}
        onPress={() => setVal(!val)}
      />
    </View>
  );
  //   // return (
  //   // <Provider store={store}>
  //   //   <UIProvider theme={defaultTheme}>
  //   //     <NavigationContainer>{/* <DrawerNavigator /> */}</NavigationContainer>
  //   //   </UIProvider>
  //   // </Provider>
  //   // );
};

const App = () => {
  // const [val, setVal] = useState(false);
  // return (
  //   <View style={styles.container}>
  //     <MediumText>Open up App.js to start working on your app!</MediumText>
  //     <StatusBar style="auto" />
  //     <SelectableInput
  //       label="Организация"
  //       placeholder="Выберите покупателя..."
  //       value={val ? 'Отгрузка' : 'Склад'}
  //       onPress={() => setVal(!val)}
  //     />
  //   </View>
  // );
  const rootReducer = combineReducers(reducers);

  const store = createStore(rootReducer);
  return (
    <Provider store={store}>
      {/* <UIProvider theme={defaultTheme}>
        <NavigationContainer>{/* <DrawerNavigator /> */}
      {/* </NavigationContainer>
      </UIProvider> */}
      <AppOne />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
///////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Alert, View, StyleSheet, ScrollView, Platform, Keyboard } from 'react-native';
// import { useTheme, useIsFocused } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Divider } from 'react-native-paper';

// import { documentActions, refSelectors, useSelector, appActions, useDispatch } from '@lib/store';
// import {
//   AppInputScreen,
//   Input,
//   SelectableInput,
//   // SaveButton,
//   SubTitle,
//   RadioGroup,
//   AppActivityIndicator,
// } from '@lib/mobile-ui';
// import { IDocumentType, IReference, ScreenState, StatusType } from '@lib/types';

// import { generateId, getDateString, useFilteredDocList } from '@lib/mobile-app';

// import { IListItem } from '@lib/mobile-types';
// import { Provider } from 'react-redux';

// import { store } from './src/store';

// export const getNextDocNumber = (documents?: IOrderDocument[]) => {
//   return (
//     (documents
//       ?.map((item) => parseInt(item.number, 10))
//       ?.reduce((newId, currId) => (newId > currId ? newId : currId), 0) || 0) + 1 || 1
//   ).toString();
// };

// export const STATUS_LIST: IListItem[] = [
//   { id: 'DRAFT', value: 'Черновик' },
//   { id: 'READY', value: 'Готов' },
// ];
// export interface IEntity {
//   id: string;
//   creationDate?: string;
//   editionDate?: string;
// }

// export interface IGood extends INamedEntity {
//   [fieldName: string]: unknown;
//   alias: string;
//   barcode: string;
//   vat: string; //НДС
//   goodgroup: INamedEntity; // группа товаров
//   valueName: string; // Наименование ед. изм.
//   invWeight: number; // Вес единицы товара
//   priceFso: number; // цена ФСО
//   priceFsn: number; // цена ФСН
//   priceFsoSklad: number; // цена ФСО склад
//   priceFsnSklad: number; // цена ФСН склад
//   scale: number; //количество единиц в месте
// }
// export interface INamedEntity extends IEntity {
//   name: string;
// }
// interface IReferenceData extends IEntity {
//   [fieldName: string]: any;
// }

// export interface IHead {
//   [fieldname: string]: any;
// }
// export interface IOrderHead extends IHead {
//   contact: IReferenceData; //организация-плательщик
//   outlet: IReferenceData; // магазин –подразделение организации плательщика
//   route?: IReferenceData; // 	Маршрут
//   depart?: IReferenceData; // Необязательное поле склад (подразделение предприятия-производителя)
//   onDate: string; //  Дата отгрузки
//   takenOrder?: TakeOrderType; //тип взятия заявки
//   comment?: string;
// }

// export type TakeOrderType = 'ON_PLACE' | 'BY_PHONE' | 'BY_EMAIL';

// export interface IOrderLine extends IEntity {
//   good: IGood;
//   quantity: number;
//   package?: INamedEntity; // Вид упаковки
// }

// export interface IOrderTotalLine {
//   group: INamedEntity;
//   quantity: number;
//   sum: number;
//   sumVat: number;
// }

// export type IOrderDocument = MandateProps<IDocument<IOrderHead, IOrderLine>, 'head' | 'lines'>;

// type Meta<T> = {
//   [P in keyof T]?: {
//     visible?: boolean;
//     sortOrder?: number;
//     name?: string;
//     required?: boolean;
//     type?: 'string' | 'date' | 'number' | 'boolean' | 'ref';
//     refName?: string;
//   };
// };

// type DocfMetadata<T, K> = {
//   head?: Meta<T>;
//   lines?: Meta<K>;
// };
// interface IDocument<T = IHead, K extends IEntity = IEntity> extends IEntity {
//   number: string;
//   documentDate: string;
//   documentType: IDocumentType;
//   status: StatusType;
//   metadata?: DocfMetadata<T, K>;
//   errorMessage?: string;
//   head?: T;
//   lines?: K[];
// }

// type MandateProps<T extends IEntity, K extends keyof T> = Omit<T, K> & {
//   [MK in K]-?: NonNullable<T[MK]>;
// };

// export interface IFormParam {
//   [fieldName: string]: unknown;
// }

// export interface IOrderFormParam extends IFormParam {
//   contact?: IReferenceData;
//   outlet?: IReferenceData;
//   depart?: IReferenceData;
//   number?: string;
//   documentDate?: string;
//   onDate?: string;
//   status?: StatusType;
//   route?: IReferenceData;
//   comment?: string;
// }

// export interface IOutlet extends INamedEntity, IReferenceData {
//   company: INamedEntity; //организация-плательщик
//   address: string; //Адрес разгрузки
//   phoneNumber: string; // Номер телефона
//   lat: number; // широта
//   lon: number; // долгота
// }

// const AppOne = () => {
//   // const { id, routeId } = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params || {};
//   // const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderEdit'>>();
//   const dispatch = useDispatch();

//   const { colors } = useTheme();

//   const orders = useFilteredDocList<IOrderDocument>('order');

//   const orderType = refSelectors
//     .selectByName<IReference<IDocumentType>>('documentType')
//     ?.data.find((t) => t.name === 'order');

//   const {
//     contact: docContact,
//     outlet: docOutlet,
//     depart: docDepart,
//     number: docNumber,
//     documentDate: docDocumentDate,
//     onDate: docOnDate,
//     status: docStatus,
//     comment: docComment,
//   } = useSelector((state) => state.app.formParams as IOrderFormParam);

//   // Подразделение по умолчанию
//   const defaultDepart = useSelector((state) => state.auth.user?.settings?.depart?.data);

//   useEffect(() => {
//     return () => {
//       dispatch(appActions.clearFormParams());
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const outlet = refSelectors.selectByName<IOutlet>('outlet')?.data?.find((e) => e.id === docOutlet?.id);

//   useEffect(() => {
//     if (!docContact && !!docOutlet) {
//       dispatch(
//         appActions.setFormParams({
//           contact: outlet?.company,
//         }),
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, docOutlet, outlet?.company]);

//   useEffect(() => {
//     if (!!docContact && !!docOutlet && docContact.id !== outlet?.company.id) {
//       dispatch(
//         appActions.setFormParams({
//           outlet: undefined,
//         }),
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, docContact?.id, outlet?.company.id]);

//   useEffect(() => {
//     // Инициализируем параметры

//     const newNumber = getNextDocNumber(orders);

//     const tomorrow = new Date();
//     const newDocDate = tomorrow.toISOString();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const newOnDate = tomorrow.toISOString();

//     dispatch(
//       appActions.setFormParams({
//         number: newNumber,
//         onDate: newOnDate,
//         documentDate: newDocDate,
//         status: 'DRAFT',
//         depart: defaultDepart,
//       }),
//     );

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch, defaultDepart]);

//   const [screenState, setScreenState] = useState<ScreenState>('idle');

//   useEffect(() => {
//     if (screenState === 'saving') {
//       if (!orderType) {
//         setScreenState('idle');
//         return Alert.alert('Ошибка!', 'Тип документа для заявок не найден', [{ text: 'OK' }]);
//       }

//       if (!(docNumber && docContact && docOutlet && docOnDate && docDocumentDate)) {
//         setScreenState('idle');
//         return Alert.alert('Ошибка!', 'Не все поля заполнены.', [{ text: 'OK' }]);
//       }

//       const docId = generateId();

//       const newOrderDate = new Date().toISOString();

//       const newOrder: IOrderDocument = {
//         id: docId,
//         documentType: orderType,
//         number: docNumber,
//         documentDate: newOrderDate,
//         status: 'DRAFT',
//         head: {
//           contact: docContact,
//           onDate: docOnDate,
//           outlet: docOutlet,
//           depart: docDepart,
//           comment: docComment && docComment.trim(),
//         },
//         lines: [],
//         creationDate: newOrderDate,
//         editionDate: newOrderDate,
//       };
//       dispatch(documentActions.addDocument(newOrder));
//     }
//   }, [
//     orderType,
//     docNumber,
//     docContact,
//     docOutlet,
//     docOnDate,
//     docDocumentDate,
//     docDepart,
//     docComment,
//     dispatch,
//     docStatus,
//     screenState,
//   ]);

//   // const renderRight = useCallback(
//   //   () => <SaveButton onPress={() => setScreenState('saving')} disabled={screenState === 'saving'} />,
//   //   [screenState],
//   // );

//   // useLayoutEffect(() => {
//   //   navigation.setOptions({
//   //     headerLeft: navBackButton,
//   //     headerRight: renderRight,
//   //   });
//   // }, [navigation, renderRight]);

//   const isBlocked = docStatus !== 'DRAFT';

//   const statusName = 'Новый документ';

//   // Окно календаря для выбора даты
//   const [showOnDate, setShowOnDate] = useState(false);

//   const handleApplyOnDate = useCallback(
//     (_event: any, selectedOnDate: Date | undefined) => {
//       //Закрываем календарь и записываем выбранную дату
//       setShowOnDate(false);

//       if (selectedOnDate) {
//         dispatch(appActions.setFormParams({ onDate: selectedOnDate.toISOString() }));
//       }
//     },
//     [dispatch],
//   );

//   const handlePresentOnDate = useCallback(() => {
//     Keyboard.dismiss();
//     if (docStatus !== 'DRAFT') {
//       return;
//     }

//     setShowOnDate(true);
//   }, [docStatus]);

//   const handlePresentContact = useCallback(() => {
//     if (isBlocked) {
//       return;
//     }

//     // navigation.navigate('SelectRefItem', {
//     //   refName: 'contact',
//     //   fieldName: 'contact',
//     //   value: docContact && [docContact],
//     // });
//   }, [isBlocked]);

//   const handlePresentOutlet = useCallback(() => {
//     if (isBlocked) {
//       return;
//     }

//     // if (order?.head.route?.id) {
//     //   return Alert.alert('Внимание!', 'Нельзя менять магазин! Документ заявки привязан к маршруту.', [{ text: 'OK' }]);
//     // }

//     //TODO: если изменился контакт, то и магазин должен обнулиться
//     const params: Record<string, string> = {};

//     if (docContact?.id) {
//       params.companyId = docContact?.id;
//     }

//     // navigation.navigate('SelectRefItem', {
//     //   refName: 'outlet',
//     //   fieldName: 'outlet',
//     //   clause: params,
//     //   value: docOutlet && [docOutlet],
//     //   descrFieldName: 'address',
//     // });
//   }, [docContact?.id, isBlocked]);

//   const handlePresentDepart = useCallback(() => {
//     if (isBlocked) {
//       return;
//     }

//     // navigation.navigate('SelectRefItem', {
//     //   refName: 'department',
//     //   fieldName: 'depart',
//     //   value: docDepart && [docDepart],
//     // });
//   }, [isBlocked]);

//   const handleChangeStatus = useCallback(() => {
//     dispatch(appActions.setFormParams({ status: docStatus === 'DRAFT' ? 'READY' : 'DRAFT' }));
//   }, [dispatch, docStatus]);

//   const handleChangeNumber = useCallback(
//     (text: string) => dispatch(appActions.setFormParams({ number: text.trim() })),
//     [dispatch],
//   );

//   const viewStyle = useMemo(
//     () => [
//       localStyles.switchContainer,
//       localStyles.border,
//       { borderColor: colors.primary, backgroundColor: colors.card },
//     ],
//     [colors.card, colors.primary],
//   );

//   const isFocused = useIsFocused();
//   if (!isFocused) {
//     return <AppActivityIndicator />;
//   }

//   return (
//     // <Provider store={store}>
//     <AppInputScreen>
//       <SubTitle>{statusName}</SubTitle>
//       <Divider />
//       <ScrollView keyboardShouldPersistTaps={'handled'}>
//         <View style={viewStyle}>
//           <RadioGroup
//             options={STATUS_LIST}
//             onChange={handleChangeStatus}
//             activeButtonId={STATUS_LIST.find((i) => i.id === docStatus)?.id}
//             directionRow={true}
//           />
//         </View>
//         <Input label="Номер" value={docNumber} onChangeText={handleChangeNumber} disabled={isBlocked} />
//         <SelectableInput
//           label="Дата отгрузки"
//           value={getDateString(docOnDate || '')}
//           onPress={handlePresentOnDate}
//           disabled={docStatus !== 'DRAFT'}
//         />
//         <SelectableInput
//           label="Организация"
//           placeholder="Выберите покупателя..."
//           value={docContact?.name}
//           onPress={handlePresentContact}
//           disabled={isBlocked}
//         />
//         <SelectableInput label="Магазин" value={docOutlet?.name} onPress={handlePresentOutlet} disabled={isBlocked} />
//         <SelectableInput
//           label="Склад-магазин"
//           value={docDepart?.name}
//           onPress={handlePresentDepart}
//           disabled={isBlocked}
//         />
//         <Input
//           label="Комментарий"
//           value={docComment}
//           onChangeText={(text) => {
//             dispatch(appActions.setFormParams({ comment: text || '' }));
//           }}
//           disabled={docStatus !== 'DRAFT'}
//           clearInput={true}
//         />
//       </ScrollView>
//       {showOnDate && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={new Date(docOnDate || '')}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'inline' : 'default'}
//           onChange={handleApplyOnDate}
//         />
//       )}
//     </AppInputScreen>
//     // {/* </Provider> */}
//   );
// };

// export default function App() {
//   // return (
//   //   <View style={styles.container}>
//   //     <MediumText>Open up App.js to start working on your app!</MediumText>
//   //     <StatusBar style="auto" />
//   //   </View>
//   // );
//   // return (
//   // <Provider store={store}>
//   //   <UIProvider theme={defaultTheme}>
//   //     <NavigationContainer>{/* <DrawerNavigator /> */}</NavigationContainer>
//   //   </UIProvider>
//   // </Provider>
//   // );
//   <Provider store={store}>
//     <AppOne />
//   </Provider>;
// }

// const localStyles = StyleSheet.create({
//   switchContainer: {
//     marginVertical: 10,
//   },
//   border: {
//     marginHorizontal: 10,
//     marginVertical: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderRadius: 2,
//   },
// });
