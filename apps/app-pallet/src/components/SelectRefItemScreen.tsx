import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, Checkbox } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { IReferenceData, ScreenState } from '@lib/types';
import { appActions, refSelectors } from '@lib/store';
import { FlashList } from '@shopify/flash-list';
import {
  AppScreen,
  ItemSeparator,
  SaveButton,
  SearchButton,
  SubTitle,
  globalStyles as styles,
  navBackButton,
  LargeText,
  EmptyList,
} from '@lib/mobile-ui';

import { extraPredicate } from '@lib/mobile-hooks';

import { useDispatch } from '../store';
import { RefParamList } from '../navigation/Root/types';

const keyExtractor = (item: IReferenceData) => item.id;

export const SelectRefItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const {
    refName,
    isMulti,
    fieldName,
    value,
    clause,
    refFieldName = 'name',
    descrFieldName,
  } = useRoute<RouteProp<RefParamList, 'SelectRefItem'>>().params;

  const refObj = refSelectors.selectByName<IReferenceData>(refName);

  const list: IReferenceData[] = useMemo(() => {
    if (clause && refObj?.data) {
      return refObj?.data.filter((item) => {
        const newParams = Object.assign({}, clause);

        Object.keys(clause).forEach((i) => {
          if (i in item) {
            if (typeof clause[i] !== 'object' && typeof item[i] !== 'object' && item[i] === clause[i]) {
            }
          }
        });
        return extraPredicate(item, newParams);
      });
    }
    return refObj?.data?.sort((a, b) => (a[refFieldName] < b[refFieldName] ? -1 : 1));
  }, [clause, refFieldName, refObj?.data]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMulti, list, descrFieldName, refFieldName, searchQuery, value]);

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
        setCheckedItem((prev) => [...(prev as IReferenceData[]), item]);
      } else if (checkedItem.find((i) => i.id === item.id)) {
        setCheckedItem([]);
        dispatch(
          appActions.setFormParams({
            [fieldName]: undefined,
          }),
        );
      } else {
        setScreenState('saving');
        dispatch(
          appActions.setFormParams({
            [fieldName]: item,
          }),
        );
        navigation.goBack();
      }
    },
    [isMulti, checkedItem, dispatch, fieldName, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IReferenceData }) => {
      const isChecked = !!checkedItem?.find((i) => i.id === item.id);
      return (
        <LineItem
          item={item}
          isChecked={isChecked}
          onCheck={handleSelectItem}
          descrFieldName={descrFieldName}
          refFieldName={refFieldName}
          disabled={screenState === 'saving' ? true : false}
        />
      );
    },
    [checkedItem, descrFieldName, handleSelectItem, refFieldName, screenState],
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
              dispatch(appActions.setFormParams({ [fieldName]: checkedItem }));
              navigation.goBack();
            }}
          />
        )}
      </View>
    ),
    [checkedItem, dispatch, fieldName, filterVisible, isMulti, navigation],
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
      <FlashList
        data={filteredList}
        estimatedItemSize={60}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
        extraData={[screenState, checkedItem]}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
      />
    </AppScreen>
  );
};

const LineItem = React.memo(
  ({
    item,
    isChecked,
    onCheck,
    refFieldName,
    descrFieldName,

    disabled,
  }: {
    item: IReferenceData;
    isChecked: boolean;
    onCheck: (id: IReferenceData) => void;
    descrFieldName?: string;

    refFieldName: string;
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
              <Text style={textStyle}>{item[refFieldName] || item.id}</Text>
            </View>
            {descrFieldName && item[descrFieldName] ? (
              <View style={styles.rowCenter}>
                <LargeText style={styles.textDescription}>УНП: {item[descrFieldName]}</LargeText>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
