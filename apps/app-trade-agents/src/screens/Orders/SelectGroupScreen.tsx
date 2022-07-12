import React, { useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Divider, IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useIsFocused, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  AppScreen,
  ItemSeparator,
  SubTitle,
  globalStyles as styles,
  EmptyList,
  AppActivityIndicator,
} from '@lib/mobile-ui';
import { appActions, docSelectors, refSelectors, useDispatch, useSelector } from '@lib/store';

import { getDateString, keyExtractor } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IGoodGroup, IMGroupModel, IOrderDocument } from '../../store/types';
import { getGroupModelByContact } from '../../utils/helpers';
import { UNKNOWN_GROUP } from '../../utils/constants';
import { navBackButton } from '../../components/navigateOptions';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

interface IProp {
  docId: string;
  model: IMGroupModel;
  item: IGoodGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
  onPressGroup: (groupId: string) => void;
  searchQuery?: string;
}

const Group = ({ docId, model, item, expendGroup, setExpend, searchQuery, onPressGroup }: IProp) => {
  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const nextLevelGroupsList = useMemo(() => {
    return model[item.id]?.children?.map((gr) => gr.group) || [];
  }, [item.id, model]);

  const nextLevelGroups = useMemo(() => {
    return nextLevelGroupsList?.filter((i) =>
      i.name ? i.name.toUpperCase().includes(searchQuery?.toUpperCase() || '') : true,
    );
  }, [nextLevelGroupsList, searchQuery]);

  const isExpand = useMemo(() => {
    return expendGroup === item.id || !!nextLevelGroups?.find((group) => group.id === expendGroup);
  }, [expendGroup, item.id, nextLevelGroups]);

  const icon = useMemo(
    () => (nextLevelGroups?.length === 0 ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon,
    [isExpand, nextLevelGroups?.length],
  );

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const renderGroup = useCallback(
    ({ item: grItem }: { item: IGoodGroup }) => {
      return (
        <Group
          docId={docId}
          model={model}
          key={grItem.id}
          item={grItem}
          expendGroup={expendGroup}
          setExpend={setExpend}
          onPressGroup={onPressGroup}
        />
      );
    },
    [docId, expendGroup, model, onPressGroup, setExpend],
  );

  const len = useMemo(
    () => model[item.parent?.id || '']?.children?.find((gr) => gr.group.id === item.id)?.goods?.length,
    [item.id, item.parent?.id, model],
  );

  const handlePressGroup = useCallback(
    () =>
      nextLevelGroups?.length && nextLevelGroups?.length > 0
        ? setExpend(!isExpand ? item : undefined)
        : onPressGroup(item.id),
    [isExpand, item, nextLevelGroups?.length, onPressGroup, setExpend],
  );

  return (
    <>
      <TouchableOpacity style={styles.item} onPress={handlePressGroup}>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name || item.name}</Text>
          {nextLevelGroups?.length === 0 && (
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} />
              <Text style={styles.field}>{len}</Text>
            </View>
          )}
        </View>
        <MaterialCommunityIcons name={icon} size={24} color="black" />
      </TouchableOpacity>
      {isExpand && nextLevelGroups && nextLevelGroups?.length > 0 && (
        <View style={localStyles.marginLeft}>
          {nextLevelGroups && nextLevelGroups?.length > 0 && (
            <FlatList
              ref={refListGroups}
              data={nextLevelGroups}
              keyExtractor={keyExtractor}
              renderItem={renderGroup}
              ItemSeparatorComponent={ItemSeparator}
              ListEmptyComponent={EmptyList}
            />
          )}
        </View>
      )}
    </>
  );
};

const SelectGroupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const dispatch = useDispatch();

  const { colors } = useTheme();
  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const isUseNetPrice = useSelector((state) => state.settings.data?.isUseNetPrice?.data) as boolean;

  const syncDate = useSelector((state) => state.app.syncDate);
  const isDemo = useSelector((state) => state.auth.isDemo);

  useEffect(() => {
    if (syncDate && getDateString(syncDate) !== getDateString(new Date()) && !isDemo) {
      return Alert.alert('Внимание!', 'В справочнике устаревшие данные, требуется синхронизация', [{ text: 'OK' }]);
    }
  }, [syncDate, isDemo]);

  const formParams = useSelector((state) => state.app.formParams);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data?.[0];

  const goods = refSelectors.selectByName<IGood>('good').data;

  const refGroup = refSelectors.selectByName<IGoodGroup>('goodGroup');

  const groups = useMemo(() => refGroup.data.concat(UNKNOWN_GROUP), [refGroup.data]);

  const contactId = docSelectors.selectByDocId<IOrderDocument>(docId)?.head.contact.id;

  const model = useMemo(
    () => getGroupModelByContact(groups, goods, goodMatrix[contactId], isUseNetPrice),
    [groups, goods, goodMatrix, contactId, isUseNetPrice],
  );

  const firstLevelGroups = useMemo(() => Object.values(model).map((item) => item.parent), [model]);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <IconButton
        icon="card-search-outline"
        style={filterVisible && { backgroundColor: colors.card }}
        size={26}
        onPress={() => setFilterVisible((prev) => !prev)}
      />
    ),
    [colors.card, filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });

    if (formParams?.groupId) {
      const expandGroup = groups.find((group) => group.id === formParams.groupId);
      setExpend(expandGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, formParams?.groupId, renderRight]);

  const handleSetExpand = useCallback(
    (group: IGoodGroup | undefined) => {
      setExpend(group);
      dispatch(
        appActions.setFormParams({
          groupId: group?.id,
        }),
      );
    },
    [dispatch],
  );

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const pressGroup = useCallback(
    (groupId: string) =>
      navigation.navigate('SelectGoodItem', {
        docId,
        groupId,
      }),
    [docId, navigation],
  );

  const handleExpend = useCallback((group: IGoodGroup | undefined) => handleSetExpand(group), [handleSetExpand]);

  const renderGroup = useCallback(
    ({ item }: { item: IGoodGroup }) => (
      <Group
        key={item.id}
        docId={docId}
        model={model}
        item={item}
        expendGroup={expend?.id}
        setExpend={handleExpend}
        searchQuery={searchQuery}
        onPressGroup={pressGroup}
      />
    ),
    [docId, expend?.id, handleExpend, model, pressGroup, searchQuery],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{refGroup.description || refGroup.name}</SubTitle>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={searchStyle}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        ref={refListGroups}
        data={firstLevelGroups}
        keyExtractor={keyExtractor}
        renderItem={renderGroup}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
      />
    </AppScreen>
  );
};

export default SelectGroupScreen;

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 20,
  },
});
