import React, { useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Button, Dialog, Divider, Searchbar } from 'react-native-paper';
import { RouteProp, useIsFocused, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  AppScreen,
  ItemSeparator,
  SubTitle,
  globalStyles as styles,
  EmptyList,
  Menu,
  SearchButton,
  navBackButton,
  AppActivityIndicator,
  MediumText,
  LargeText,
  globalColors,
} from '@lib/mobile-ui';
import { appActions, docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { generateId, getDateString, keyExtractor } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { IListItem } from '@lib/mobile-types';

import { OrdersStackParamList } from '../../navigation/Root/types';
import { IGood, IGoodMatrix, IGoodGroup, IMGroupModel, IOrderDocument, IOrderLine } from '../../store/types';
import { getGoodMatrixByContact, getGroupModelByContact } from '../../utils/helpers';
import { UNKNOWN_GROUP, viewTypeList } from '../../utils/constants';

type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

interface IProp {
  docId: string;
  model: IMGroupModel;
  item: IGoodGroup;
  expendGroup: string | undefined;
  setExpend: (group: IGoodGroup | undefined) => void;
  onPressGood: (good: IGood) => void;
}

const Group = ({ docId, model, item, expendGroup, setExpend, onPressGood }: IProp) => {
  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const refListGroups = React.useRef<FlatList<IGoodGroup>>(null);
  useScrollToTop(refListGroups);

  const nextLevelGroups = useMemo(() => model[item.id]?.children?.map((gr) => gr.group) || [], [item.id, model]);

  const isExpand = useMemo(
    () => expendGroup === item.id || !!nextLevelGroups?.find((group) => group.id === expendGroup),
    [expendGroup, item.id, nextLevelGroups],
  );

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
          onPressGood={onPressGood}
        />
      );
    },
    [docId, expendGroup, model, onPressGood, setExpend],
  );
  const doc = docSelectors.selectByDocId<IOrderDocument>(docId);

  const renderGood = useCallback(
    ({ item: itemGood }: { item: IGood }) => {
      const lines = doc.lines?.filter((i) => i.good.id === itemGood.id);
      return <Good key={itemGood.id} item={itemGood} onPress={onPressGood} lines={lines} />;
    },
    [doc.lines, onPressGood],
  );

  const goodModel = useMemo(
    () =>
      model[item.parent?.id || '']?.children
        ?.find((gr) => gr.group.id === item.id)
        ?.goods?.sort((a, b) => (a.name < b.name ? -1 : 1)) || [],

    [item.id, item.parent?.id, model],
  );

  const len = goodModel.length;

  const icon = useMemo(
    () =>
      (nextLevelGroups?.length === 0 && !isExpand ? 'chevron-right' : isExpand ? 'chevron-up' : 'chevron-down') as Icon,
    [isExpand, nextLevelGroups?.length],
  );

  const handlePressGroup = useCallback(() => {
    setExpend(!isExpand ? item : item.parent);
  }, [isExpand, item, setExpend]);

  const refList = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refList);

  return (
    <View key={item.id}>
      <TouchableOpacity style={localStyles.item} onPress={handlePressGroup}>
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
      {goodModel.length > 0 && isExpand && (
        <FlatList
          ref={refList}
          data={goodModel}
          renderItem={renderGood}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true} // Unmount compsonents when outside of window
          initialNumToRender={20}
          maxToRenderPerBatch={20} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      )}
      {isExpand && nextLevelGroups && nextLevelGroups?.length > 0 && nextLevelGroups && nextLevelGroups?.length > 0 && (
        <View style={localStyles.marginLeft}>
          <FlatList
            ref={refListGroups}
            data={nextLevelGroups}
            keyExtractor={keyExtractor}
            renderItem={renderGroup}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={EmptyList}
          />
        </View>
      )}
    </View>
  );
};

interface IGoodProp {
  item: IGood;
  onPress: (item: IGood, line?: IOrderLine) => void;
  lines?: IOrderLine[];
}

const Good = ({ item, onPress, lines }: IGoodProp) => {
  const isAdded = !!lines?.length;
  const isOneAdded = lines && lines.length === 1;
  const iconStyle = [styles.icon, { backgroundColor: isAdded ? '#06567D' : '#E91E63' }];

  const goodStyle = {
    backgroundColor: isAdded ? globalColors.backgroundLight : 'transparent',
  };

  return (
    <TouchableOpacity onPress={() => (isOneAdded ? onPress(item, lines[0]) : !isAdded && onPress(item))}>
      <View style={[localStyles.item, goodStyle]}>
        <View style={iconStyle}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <MediumText style={styles.textBold}>{item.name || item.id}</MediumText>
          {isAdded
            ? lines.map((line, xid) => (
                <TouchableOpacity key={line.id} onPress={() => onPress(line.good, line)} disabled={isOneAdded}>
                  <View style={[styles.directionColumn, localStyles.line]}>
                    <View style={styles.flexDirectionRow}>
                      {/* <MaterialCommunityIcons name="drag-vertical-variant" size={18} /> */}
                      <MediumText>{line.quantity} кг</MediumText>
                      <MediumText>, упаковка: {line.package ? line.package.name : 'без упаковки'}</MediumText>
                    </View>
                  </View>
                  {xid !== lines.length - 1 && <ItemSeparator />}
                </TouchableOpacity>
              ))
            : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SelectGroupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'SelectGroupItem'>>();
  const { docId } = useRoute<RouteProp<OrdersStackParamList, 'SelectGroupItem'>>().params;

  const dispatch = useDispatch();

  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('groups');
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

  const doc = docSelectors.selectByDocId<IOrderDocument>(docId);
  const contactId = doc.head.contact.id;

  const model = useMemo(
    () => getGroupModelByContact(groups, goods, goodMatrix[contactId], isUseNetPrice, searchQuery),
    [groups, goods, goodMatrix, contactId, isUseNetPrice, searchQuery],
  );

  const goodModel = useMemo(
    () =>
      contactId && viewType === 'goods'
        ? getGoodMatrixByContact(goods, goodMatrix[contactId], isUseNetPrice, undefined, searchQuery)?.sort((a, b) =>
            a.name < b.name ? -1 : 1,
          )
        : [],
    [contactId, viewType, goods, goodMatrix, isUseNetPrice, searchQuery],
  );

  const firstLevelGroups = useMemo(() => Object.values(model).map((item) => item.parent), [model]);

  const [expend, setExpend] = useState<IGoodGroup | undefined>(firstLevelGroups[0]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const [isVisibleTypeMenu, setIsVisibleTypeMenu] = useState(false);

  const handleCnangeViewType = (option: IListItem) => {
    setViewType(option.id);
    setIsVisibleTypeMenu(false);
  };

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
      </View>
    ),
    [filterVisible],
  );

  useEffect(() => {
    if (formParams?.groupId && formParams?.groupId !== expend?.id) {
      const expandGroup = groups.find((group) => group.id === formParams.groupId);
      setExpend(expandGroup?.parent || expandGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

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

  const [selectedItem, setSelectedItem] = useState<IOrderLine | undefined>(undefined);

  const handlePressGood = useCallback(
    (item: IGood, line?: IOrderLine) => {
      if (line) {
        setSelectedItem(line);
      } else {
        navigation.navigate('OrderLine', { mode: 0, docId, item: { id: generateId(), good: item, quantity: 0 } });
      }
    },
    [docId, navigation],
  );

  const handleAddGood = useCallback(() => {
    if (selectedItem) {
      navigation.navigate('OrderLine', {
        mode: 0,
        docId,
        item: { id: generateId(), good: selectedItem.good, quantity: 0 },
      });
      setSelectedItem(undefined);
    }
  }, [docId, selectedItem, navigation]);

  const handleEditLine = useCallback(() => {
    if (selectedItem) {
      navigation.navigate('OrderLine', { mode: 1, docId, item: selectedItem });
      setSelectedItem(undefined);
    }
  }, [docId, navigation, selectedItem]);

  const handleDeleteGood = useCallback(() => {
    if (selectedItem) {
      dispatch(documentActions.removeDocumentLine({ docId, lineId: selectedItem.id }));
      setSelectedItem(undefined);
    }
  }, [dispatch, docId, selectedItem]);

  const renderGroup = useCallback(
    ({ item }: { item: IGoodGroup }) => (
      <Group
        key={item.id}
        docId={docId}
        model={model}
        item={item}
        expendGroup={expend?.id || expend?.parent?.id}
        setExpend={handleSetExpand}
        onPressGood={handlePressGood}
      />
    ),
    [docId, expend?.id, expend?.parent?.id, handleSetExpand, handlePressGood, model],
  );

  const refListGood = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(refListGood);

  const renderGood = useCallback(
    ({ item: itemGood }: { item: IGood }) => {
      const lines = doc.lines?.filter((i) => i.good.id === itemGood.id);
      return <Good key={itemGood.id} item={itemGood} onPress={handlePressGood} lines={lines} />;
    },
    [doc.lines, handlePressGood],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <View style={[styles.rowCenter, styles.containerCenter]}>
        <SubTitle style={styles.title}>{viewTypeList.find((t) => t.id === viewType)?.value || ''}</SubTitle>
        <Menu
          key={'MenuType'}
          visible={isVisibleTypeMenu}
          onChange={handleCnangeViewType}
          onDismiss={() => setIsVisibleTypeMenu(false)}
          onPress={() => setIsVisibleTypeMenu(true)}
          options={viewTypeList}
          iconName={'menu-down'}
          iconSize={26}
          activeOptionId={viewType}
        />
      </View>
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
              selectionColor={colors.primary}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      {viewType === 'goods' ? (
        <FlatList
          ref={refListGood}
          data={goodModel}
          renderItem={renderGood}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true} // Unmount compsonents when outside of window
          initialNumToRender={20}
          maxToRenderPerBatch={20} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      ) : (
        <FlatList
          ref={refListGroups}
          data={firstLevelGroups}
          keyExtractor={keyExtractor}
          renderItem={renderGroup}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={EmptyList}
        />
      )}
      <Dialog visible={!!selectedItem} onDismiss={() => setSelectedItem(undefined)}>
        <Dialog.Title style={localStyles.titleSize}>{selectedItem?.good.name}</Dialog.Title>
        <Dialog.Content>
          <LargeText>Количество: {selectedItem?.quantity} кг</LargeText>
          <LargeText>Упаковка: {selectedItem?.package ? selectedItem.package.name : 'без упаковки'}</LargeText>
          <ItemSeparator />
          <LargeText style={localStyles.text}>
            Нажмите 'Редактировать', если хотите редактировать существующую позицию.
          </LargeText>
          <LargeText style={localStyles.text}>Нажмите 'Добавить', если хотите добавить новую позицию.</LargeText>
          <LargeText style={localStyles.text}>Нажмите 'Удалить', если хотите удалить существующую позицию.</LargeText>
        </Dialog.Content>
        <Dialog.Actions style={localStyles.action}>
          <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={handleEditLine}>
            Редактировать
          </Button>
          <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={handleAddGood}>
            Добавить
          </Button>
          <Button labelStyle={{ color: colors.primary }} color={colors.primary} onPress={handleDeleteGood}>
            Удалить
          </Button>
          <Button color={colors.primary} onPress={() => setSelectedItem(undefined)}>
            Отмена
          </Button>
        </Dialog.Actions>
      </Dialog>
    </AppScreen>
  );
};

export default SelectGroupScreen;

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 20,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 3,
    minHeight: 50,
  },
  titleSize: {
    fontSize: 18,
  },
  text: { fontSize: 15, paddingTop: 5 },
  action: { flexDirection: 'column', alignItems: 'flex-end' },
  line: {
    height: 20,
    justifyContent: 'center',
    margin: 6,
    marginTop: 10,
  },
});
