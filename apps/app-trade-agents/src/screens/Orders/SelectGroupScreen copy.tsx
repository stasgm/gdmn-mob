// import React, { useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
// import { View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Divider, Searchbar } from 'react-native-paper';
// import { RouteProp, useIsFocused, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// import {
//   AppScreen,
//   ItemSeparator,
//   SubTitle,
//   globalStyles as styles,
//   EmptyList,
//   Menu,
//   SearchButton,
//   navBackButton,
//   AppActivityIndicator,
//   LargeText,
//   MediumText,
// } from '@lib/mobile-ui';
// import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';

// import { generateId, getDateString, keyExtractor } from '@lib/mobile-app';

// import { StackNavigationProp } from '@react-navigation/stack';

// import { IListItem } from '@lib/mobile-types';

// import { OrdersStackParamList } from '../../navigation/Root/types';
// import { IGood, IGoodMatrix, IGoodGroup, IMGroupModel, IOrderDocument } from '../../store/types';
// import { getGoodMatrixByContact, getGroupModelByContact } from '../../utils/helpers';
// import { UNKNOWN_GROUP, viewTypeList } from '../../utils/constants';

// type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

// interface IProp {
//   docId: string;
//   model: IMGroupModel;
//   item: IGoodGroup;
//   expendGroup: string | undefined;
//   setExpend: (group: IGoodGroup | undefined) => void;
//   onPressGood: (good: IGood) => void;
// }

// const SelectGroupScreen = () => {
//   const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
//   const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

//   const dispatch = useDispatch();

//   // const { colors } = useTheme();

//   // const [searchQuery, setSearchQuery] = useState('');
//   // const [viewType, setViewType] = useState('groups');
//   // const [filterVisible, setFilterVisible] = useState(false);

//   // const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data) as boolean;

//   // const syncDate = useSelector((state) => state.app.syncDate);
//   // const isDemo = useSelector((state) => state.auth.isDemo);

//   // useEffect(() => {
//   //   if (syncDate && getDateString(syncDate) !== getDateString(new Date()) && !isDemo) {
//   //     return Alert.alert('Внимание!', 'В справочнике устаревшие данные, требуется синхронизация', [{ text: 'OK' }]);
//   //   }
//   // }, [syncDate, isDemo]);

//   // const formParams = useSelector((state) => state.app.formParams);

//   // const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

//   // const goods = refSelectors.selectByName<IGood>('good').data;

//   // const refGroup = refSelectors.selectByName<IGoodGroup>('goodGroup');

//   // const groups = useMemo(() => refGroup.data.concat(UNKNOWN_GROUP), [refGroup.data]);

//   // const doc = docSelectors.selectByDocId<IOrderDocument>(docId);
//   // const contactId = doc.head.contact.id;

//   // const model = useMemo(
//   //   () => getGroupModelByContact(groups, goods, goodMatrix[contactId], isUseNetPrice, searchQuery),
//   //   [groups, goods, goodMatrix, contactId, isUseNetPrice, searchQuery],
//   // );

//   // const goodModel = useMemo(
//   //   () =>
//   //     contactId && viewType === 'goods'
//   //       ? getGoodMatrixByContact(goods, goodMatrix[contactId], isUseNetPrice, undefined, searchQuery)?.sort((a, b) =>
//   //           a.name < b.name ? -1 : 1,
//   //         )
//   //       : [],
//   //   [contactId, viewType, goods, goodMatrix, isUseNetPrice, searchQuery],
//   // );

//   // const firstLevelGroups = useMemo(() => Object.values(model).map((item) => item.parent), [model]);

//   // const model = {
//   //   {}
//   // }

//   // const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

//   // const [isVisibleTypeMenu, setIsVisibleTypeMenu] = useState(false);

//   // useEffect(() => {
//   //   if (formParams?.groupId && formParams?.groupId !== expend?.id) {
//   //     const expandGroup = groups.find((group) => group.id === formParams.groupId);
//   //     setExpend(expandGroup?.parent || expandGroup);
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, []);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: navBackButton,
//     });
//   }, [navigation]);

//   // const handleSetExpand = useCallback(
//   //   (group: IGoodGroup | undefined) => {
//   //     setExpend(group);
//   //     dispatch(
//   //       appActions.setFormParams({
//   //         groupId: group?.id,
//   //       }),
//   //     );
//   //   },
//   //   [dispatch],
//   // );

//   const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
//   useScrollToTop(refListGroups);

//   const renderGroup = useCallback(
//     ({ item }: { item: { id: number; name: string; groups: []; goods: [] } }) => (
//       <View>{item.name}</View>
//       // <Group
//       //   key={item.id}
//       //   docId={docId}
//       //   model={model}
//       //   item={item}
//       //   expendGroup={expend?.id || expend?.parent?.id}
//       //   setExpend={handleSetExpand}
//       //   onPressGood={handlePressGood}
//       // />
//     ),
//     [],
//   );

//   const isFocused = useIsFocused();
//   if (!isFocused) {
//     return <AppActivityIndicator />;
//   }

//   return (
//     <AppScreen>
//       <View style={[styles.rowCenter, styles.containerCenter]}>
//         <FlatList
//           ref={refListGroups}
//           data={model}
//           keyExtractor={keyExtractor}
//           renderItem={renderGroup}
//           ItemSeparatorComponent={ItemSeparator}
//           ListEmptyComponent={EmptyList}
//         />
//       </View>
//     </AppScreen>
//   );
// };

// export default SelectGroupScreen;

// const localStyles = StyleSheet.create({
//   marginLeft: {
//     marginLeft: 14,
//   },
//   item: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     padding: 2,
//     height: 86,
//   },
// });
