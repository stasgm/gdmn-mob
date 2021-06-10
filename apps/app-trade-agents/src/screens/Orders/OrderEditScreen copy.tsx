// import BottomSheet, { BottomSheetModal, TouchableOpacity } from '@gorhom/bottom-sheet';
// import { docSelectors, refSelectors } from '@lib/store';
// import { INamedEntity, IReference } from '@lib/types';
// import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import React, { useCallback, useMemo, useRef, useState } from 'react';

// import { Alert, FlatList, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';

// import { MaterialCommunityIcons } from '@expo/vector-icons';

// import { IListItem } from '@lib/mobile-types';

// import { ItemSeparator, RadioGroup, SubTitle } from '@lib/mobile-ui';

// import { OrdersStackParamList } from '../../navigation/Root/types';
// import { IContact, IOrderDocument, IOutlet } from '../../store/docs/types';
// import { getDateString } from '../../utils/helpers';

// const OrderEditScreen = () => {
//   const { colors } = useTheme();

//   const docId = useRoute<RouteProp<OrdersStackParamList, 'OrderEdit'>>().params?.id;

//   const [statusId, setStatusId] = useState(0);
//   const isBlocked = statusId !== 0;

//   const navigation = useNavigation();

//   const order = (docSelectors.selectByDocType('order') as IOrderDocument[])?.find((e) => e.id === docId);

//   // const statusName =
//   //   docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа';

//   const getListItems = <T extends IReference>(con: T[]): IListItem[] =>
//     con?.map((item) => ({ id: item.id, value: item.name }));

//   const contacts = refSelectors.selectByName('contact') as IReference<IContact>;

//   const listContact = getListItems(contacts?.data);

//   const outlets = refSelectors.selectByName('outlet') as IReference<IOutlet>;

//   const listOutlet = getListItems(outlets?.data);

//   const selectedItem = useCallback((listItems: IListItem[], id: string) => {
//     return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id == id));
//   }, []);

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     // Do something when the screen is focused
//   //     //Создания объекта в store для экрана создания или редактирования шапки документа
//   //     const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as IDocument);
//   //     setStatusId(docObj?.head?.status || 0);
//   //     // Инициализируем параметры
//   //     if (docObj) {
//   //       appActions.setForm({
//   //         documentParams: {
//   //           id: docObj?.id,
//   //           ...(docObj?.head as IDocumentParams),
//   //         },
//   //       });
//   //     } else {
//   //       //Записываем первоначальные параметры формы
//   //       //doctype - если есть список подразделений
//   //       appActions.setForm({
//   //         documentParams: {
//   //           date: new Date().toISOString().slice(0, 10),
//   //           docnumber: getNextDocNumber(appState.documents),
//   //           fromcontactId: listDepartments?.length === 1 ? listDepartments[0].id : undefined,
//   //           tocontactId: -1,
//   //           doctype: !listDocumentType?.length ? undefined : config.system[0].defaultDocType[0],
//   //           status: 0,
//   //         },
//   //       });
//   //     }
//   //   }, [appActions, docId, appState.documents, listDepartments, listDocumentType]),
//   // );

//   // const checkDocument = useCallback(() => {
//   //   const res = date && docnumber && fromcontactId && doctype;
//   //   if (!res) {
//   //     Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
//   //   }

//   //   return res;
//   // }, [date, docnumber, fromcontactId, doctype]);

//   // useLayoutEffect(() => {
//   //   navigation.setOptions({
//   //     headerLeft: () => (
//   //       <HeaderRight
//   //         text="Отмена"
//   //         onPress={() => {
//   //           // При нажатии 'отмена' если редактирование документа
//   //           // то возвращаемся к документу, иначе к списку документов
//   //           if (docId) {
//   //             navigation.navigate('DocumentView', { docId });
//   //           } else {
//   //             navigation.navigate('DocumentList');
//   //           }
//   //         }}
//   //       />
//   //     ),
//   //     headerRight: () =>
//   //       (statusId === 0 || statusId === 1) && (
//   //         <HeaderRight
//   //           text="Готово"
//   //           onPress={() => {
//   //             if (!checkDocument()) {
//   //               return;
//   //             }

//   //             let id = docId;

//   //             if (docId !== undefined) {
//   //               appActions.updateDocument({
//   //                 id: docId,
//   //                 head: {
//   //                   doctype,
//   //                   fromcontactId,
//   //                   tocontactId,
//   //                   date,
//   //                   status,
//   //                   docnumber,
//   //                 },
//   //               });
//   //             } else {
//   //               id = getNextDocId(appState.documents);

//   //               appActions.addDocument({
//   //                 id,
//   //                 head: {
//   //                   doctype,
//   //                   fromcontactId,
//   //                   tocontactId,
//   //                   date,
//   //                   status,
//   //                   docnumber,
//   //                 },
//   //                 lines: [],
//   //               });
//   //             }

//   //             navigation.navigate('DocumentView', { docId: id });
//   //           }}
//   //         />
//   //       ),
//   //   });
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [
//   //   appActions,
//   //   docId,
//   //   navigation,
//   //   statusId,
//   //   doctype,
//   //   fromcontactId,
//   //   tocontactId,
//   //   date,
//   //   status,
//   //   docnumber,
//   //   checkDocument,
//   // ]);

//   const ReferenceItem = useCallback(
//     (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
//       return (
//         <TouchableOpacity
//           {...item}
//           // onPress={item.disabled ? null : item.onPress}
//           style={[localStyles.picker, { borderColor: colors.border }]}
//         >
//           <Text style={[localStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
//           {!item.disabled && (
//             <MaterialCommunityIcons
//               style={localStyles.pickerButton}
//               name="menu-right"
//               size={30}
//               color={colors.primary}
//             />
//           )}
//         </TouchableOpacity>
//       );
//     },
//     [colors.border, colors.primary, colors.text],
//   );

//   //---Окно bottomsheet для выбора подразделения---
//   const contactRef = useRef<BottomSheetModal>(null);

//   const contact = selectedItem(listContact, order?.head.contact.id || '');

//   //Объект подразделения из параметров формы окна
//   const [selectedFromContact, setSelectedFromContact] = useState(contact);

//   const handlePresentContact = () => {
//     //В окне Bottomsheet установим подразделение равным подразделению из параметров формы
//     //Если подразделение не указано, то первое подразделение из списка
//     if (!(contact ?? listContact?.length)) {
//       return;
//     }
//     setSelectedFromContact(contact ?? listContact[0]);
//     contactRef.current?.present();
//   };

//   const handleApplyFromContact = () => {
//     // //Запишем выбранное подразделение в параметры формы
//     // appActions.setForm({
//     //   documentParams: {
//     //     ...appState.forms?.documentParams,
//     //     fromcontactId: selectedFromContact?.id,
//     //   },
//     // });
//     contactRef.current?.dismiss();
//   };

//   const handleDismissFromContact = () => contactRef.current?.dismiss();

//   //---Окно календаря для выбора даты документа---
//   const [showDate, setShowDate] = useState(false);

//   const handleApplyDate = (event, selectedDate) => {
//     //Закрываем календарь и записываем выбранную дату в параметры формы
//     setShowDate(false);
//     if (selectedDate) {
//       // appActions.setForm({
//       //   documentParams: {
//       //     ...appState.forms?.documentParams,
//       //     date: selectedDate.toISOString().slice(0, 10),
//       //   },
//       // });
//     }
//   };

//   return (
//     <>
//       {/* <SubTitle style={[localStyles.title, { backgroundColor: colors.background }]}>{statusName}</SubTitle> */}
//       <View style={[localStyles.container, { backgroundColor: colors.card }]}>
//         <ScrollView>
//           {/* {(statusId === 0 || statusId === 1) && (
//             <>
//               <View style={localStyles.fieldContainer}>
//                 <Text>Черновик:</Text>
//                 <Switch
//                   value={status === 0}
//                   disabled={docId === undefined}
//                   onValueChange={() => {
//                     appActions.setForm({
//                       documentParams: { ...appState.forms?.documentParams, status: status === 0 ? 1 : 0 },
//                     });
//                   }}
//                 />
//               </View>
//               <ItemSeparator />
//             </>
//           )} */}
//           <ItemSeparator />
//           <View style={localStyles.fieldContainer}>
//             <Text style={localStyles.inputCaption}>Номер:</Text>
//             <TextInput
//               editable={!isBlocked}
//               style={[localStyles.input, { borderColor: colors.border }]}
//               onChangeText={
//                 (text) => console.log(text)
//                 //appActions.setForm({ documentParams: { ...appState.forms?.documentParams, docnumber: text.trim() } })
//               }
//               value={order?.number || ' '}
//             />
//           </View>
//           <ItemSeparator />
//           <View style={localStyles.fieldContainer}>
//             <Text style={localStyles.inputCaption}>Дата: </Text>
//             <ReferenceItem
//               value={getDateString(order?.documentDate || new Date().toISOString())}
//               disabled={isBlocked}
//               onPress={() => setShowDate(true)}
//             />
//           </View>
//           <ItemSeparator />
//           {/* <View style={localStyles.fieldContainer}>
//             <Text style={localStyles.inputCaption}>Тип:</Text>
//             <ReferenceItem value={documentType?.value} disabled={isBlocked} onPress={handlePresentDocType} />
//           </View> */}
//           {/* <ItemSeparator /> */}
//           <View style={localStyles.fieldContainer}>
//             <Text style={localStyles.inputCaption}>Магазин:</Text>
//             <ReferenceItem
//               value={selectedItem(listContact, order?.head.contact.id || '0')?.value}
//               disabled={isBlocked}
//               onPress={handlePresentContact}
//             />
//           </View>
//           {docId !== undefined && (
//             <TouchableOpacity
//               onPress={() => {
//                 Alert.alert('Вы уверены, что хотите удалить документ?', '', [
//                   {
//                     text: 'OK',
//                     onPress: async () => {
//                       // appActions.deleteDocument(docId);
//                       navigation.navigate('DocumentList');
//                     },
//                   },
//                   {
//                     text: 'Отмена',
//                   },
//                 ]);
//               }}
//               style={localStyles.buttonContainer}
//             >
//               <Text style={localStyles.button}>Удалить документ</Text>
//             </TouchableOpacity>
//           )}
//           {/* <BottomSheet
//             sheetRef={docTypeRef}
//             title={'Тип'}
//             handelDismiss={handleDismissDocType}
//             handelApply={handleApplyDocType}
//           >
//             <RadioGroup
//               options={listDocumentType}
//               onChange={(option) => setSelectedDocType(option)}
//               activeButtonId={selectedDocType?.id}
//             />
//           </BottomSheet> */}
//           <BottomSheet
//             sheetRef={contactRef}
//             title={'Подразделение'}
//             handelDismiss={handleDismissFromContact}
//             handelApply={handleApplyFromContact}
//           >
//             <RadioGroup
//               options={listContact}
//               onChange={(option) => setSelectedFromContact(option)}
//               activeButtonId={selectedFromContact?.id}
//             />
//           </BottomSheet>
//           {showDate && (
//             <DateTimePicker
//               testID="dateTimePicker"
//               value={new Date(date)}
//               mode={'date'}
//               is24Hour={true}
//               display="default"
//               onChange={handleApplyDate}
//             />
//           )}
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// export { OrderEditScreen as DocumentEditScreen };

// const localStyles = StyleSheet.create({
//   button: {
//     alignSelf: 'center',
//     color: '#fff',
//     fontSize: 18,
//     textTransform: 'uppercase',
//   },
//   buttonContainer: {
//     backgroundColor: '#FC3F4D',
//     borderRadius: 10,
//     elevation: 8,
//     marginTop: 4,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   container: {
//     paddingHorizontal: 5,
//   },
//   fieldContainer: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     height: 50,
//     justifyContent: 'space-between',
//     margin: 5,
//   },
//   input: {
//     borderRadius: 4,
//     borderStyle: 'solid',
//     borderWidth: 1,
//     flexGrow: 1,
//     height: 40,
//     padding: 10,
//   },
//   inputCaption: {
//     width: 70,
//   },
//   picker: {
//     borderRadius: 4,
//     borderStyle: 'solid',
//     borderWidth: 1,
//     flexDirection: 'row',
//     flex: 1,
//   },
//   pickerButton: {
//     alignSelf: 'center',
//     padding: 0,
//     textAlign: 'right',
//   },
//   pickerText: {
//     alignSelf: 'center',
//     flexGrow: 1,
//     padding: 10,
//   },
//   title: {
//     padding: 10,
//   },
// });
