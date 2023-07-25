import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, Checkbox } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import { appActions, refSelectors } from '@lib/store';
import {
  AppScreen,
  ItemSeparator,
  SaveButton,
  SearchButton,
  SubTitle,
  globalStyles as styles,
  LargeText,
  navBackButton,
} from '@lib/mobile-ui';

import { extraPredicate, keyExtractorByIndex } from '@lib/mobile-hooks';

import { IReferenceData, ScreenState } from '@lib/types';

import { useDispatch } from '../store';
import { RefParamList } from '../navigation/Root/types';
import { IAddressStoreEntity } from '../store/app/types';

const SelectRefItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const {
    screenName,
    refName,
    isMulti,
    fieldName,
    value,
    clause,
    clauseType,
    refFieldName = 'name' || 'shcode',
    descrFieldName,
  } = useRoute<RouteProp<RefParamList, 'SelectRefItem'>>().params;

  const refObj = refSelectors.selectByName<IReferenceData>(refName);

  const list = useMemo(() => {
    if (clause && refObj?.data) {
      return refObj?.data.filter((item) => {
        const newParams = Object.assign({}, clause);
        let isAddressStoreFound = true;

        Object.keys(clause).forEach((i) => {
          if (i in item) {
            if (
              typeof clause[i] !== 'object' &&
              typeof item[i] !== 'object' &&
              (clauseType === 'boolean' ? Boolean(item[i]) === Boolean(clause[i]) : item[i] === clause[i])
            ) {
            }
          }
        });

        isAddressStoreFound = newParams.isAddressStore ? Boolean((item as IAddressStoreEntity).isAddressStore) : true;
        delete newParams.isAddressStore;

        return isAddressStoreFound && extraPredicate(item, newParams);
      });
    }
    return refObj?.data?.sort((a, b) =>
      a.sortOrder && b.sortOrder
        ? (a.sortOrder || 1) < (b.sortOrder || 1)
          ? -1
          : 1
        : a[refFieldName] < b[refFieldName]
        ? -1
        : 1,
    );
  }, [clause, clauseType, refFieldName, refObj?.data]);

  const title = refObj?.description || refObj?.name;

  const [screenState, setScreenState] = useState<ScreenState>('idle');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<IReferenceData[]>();
  const [checkedItem, setCheckedItem] = useState<IReferenceData[]>(value || []);

  useEffect(() => {
    if (!list) {
      return;
    }
    setFilteredList(
      list
        .filter(
          (i) =>
            i[refFieldName]?.toUpperCase().includes(searchQuery.toUpperCase()) ||
            (descrFieldName && i[descrFieldName]?.toUpperCase().includes(searchQuery.toUpperCase())),
        )
        .sort((a) => {
          return checkedItem?.find((v) => v.id === a.id) ? -1 : 1;
        }),
    );
  }, [checkedItem, descrFieldName, isMulti, list, refFieldName, searchQuery, value]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const refList = React.useRef<FlatList<IReferenceData>>(null);
  useScrollToTop(refList);

  const handleSelectItem = useCallback(
    (item: IReferenceData) => {
      if (isMulti) {
        setCheckedItem((prev) => [
          ...(prev as IReferenceData[]),
          { id: item.id, name: item.name, shcode: item.shcode },
        ]);
      } else if (checkedItem.find((i) => i.id === item.id)) {
        setCheckedItem([]);
        dispatch(
          appActions.setScreenFormParams({
            screenName,
            params: {
              [fieldName]: undefined,
            },
          }),
        );
      } else {
        setScreenState('saving');
        dispatch(
          appActions.setScreenFormParams({
            screenName,
            params: {
              [fieldName]: { id: item.id, name: item.name, shcode: item.shcode, isAddressStore: item.isAddressStore },
            },
          }),
        );
        navigation.goBack();
      }
    },
    [isMulti, checkedItem, dispatch, fieldName, screenName, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IReferenceData }) => {
      const isChecked = !!checkedItem?.find((i) => i.id === item.id);
      return (
        <LineItem
          item={item}
          isChecked={isChecked}
          descrFieldName={descrFieldName}
          onCheck={handleSelectItem}
          disabled={screenState === 'saving' ? true : false}
        />
      );
    },
    [checkedItem, descrFieldName, handleSelectItem, screenState],
  );

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton visible={filterVisible} onPress={() => setFilterVisible((prev) => !prev)} />
        {isMulti && (
          <SaveButton
            onPress={() => {
              if (!checkedItem) {
                Alert.alert('Ошибка!', 'Необходимо выбрать элемент.', [{ text: 'OK' }]);
                return;
              }
              dispatch(appActions.setScreenFormParams({ screenName, params: { [fieldName]: checkedItem } }));
              navigation.goBack();
            }}
          />
        )}
      </View>
    ),
    [checkedItem, dispatch, fieldName, filterVisible, isMulti, navigation, screenName],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  return (
    <AppScreen>
      <SubTitle style={styles.title}>{title}</SubTitle>
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
      <FlatList
        ref={refList}
        data={filteredList}
        keyExtractor={keyExtractorByIndex}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </AppScreen>
  );
};

const LineItem = React.memo(
  ({
    item,
    isChecked,
    onCheck,
    descrFieldName,
    disabled,
  }: {
    item: IReferenceData;
    isChecked: boolean;
    onCheck: (id: IReferenceData) => void;
    descrFieldName?: string;
    disabled?: boolean;
  }) => {
    const { colors } = useTheme();
    const viewStyle = useMemo(() => [styles.item, { backgroundColor: colors.background }], [colors.background]);
    const textStyle = useMemo(() => [styles.name, { color: colors.text }], [colors.text]);

    return (
      <TouchableOpacity onPress={() => onCheck(item)} disabled={disabled}>
        <View style={viewStyle}>
          <Checkbox status={isChecked ? 'checked' : 'unchecked'} color={colors.primary} />
          <View style={styles.details}>
            <View style={styles.rowCenter}>
              <Text style={textStyle}>{item.name || item.shcode || item.id}</Text>
            </View>
            {descrFieldName ? (
              <View style={styles.rowCenter}>
                <LargeText style={styles.textDescription}>Код: {item[descrFieldName]}</LargeText>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default SelectRefItemScreen;
