import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, Checkbox } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';
import { IReferenceData } from '@lib/types';
import { appActions, refSelectors } from '@lib/store';
import { AppScreen, ItemSeparator, SaveButton, SearchButton, SubTitle, globalStyles as styles } from '@lib/mobile-ui';

import { extraPredicate } from '@lib/mobile-app';

import { useDispatch } from '../store';
import { RefParamList } from '../navigation/Root/types';

import { navBackButton } from './navigateOptions';

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

  // const formParams = useSelector((state) => state.app.formParams);

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
        .filter((i) => i[refFieldName]?.toUpperCase().includes(searchQuery.toUpperCase()))
        .sort((a) => {
          return checkedItem?.find((v) => v.id === a.id) ? -1 : 1;
        }),
    );
  }, [checkedItem, isMulti, list, refFieldName, searchQuery, value]);

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
      } else {
        dispatch(
          appActions.setFormParams({
            [fieldName]: item,
          }),
        );
        navigation.goBack();
      }
    },
    [isMulti, dispatch, fieldName, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IReferenceData }) => {
      const isChecked = !!checkedItem?.find((i) => i.id === item.id);
      return <LineItem item={item} isChecked={isChecked} onCheck={handleSelectItem} refFieldName={refFieldName} />;
    },
    [checkedItem, handleSelectItem, refFieldName],
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
              // const newFormParams: IFormParam = {
              //   ...formParams,
              //   [fieldName]: checkedItem,
              // };
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
      <FlatList
        ref={refList}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
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
    refFieldName,
  }: {
    item: IReferenceData;
    isChecked: boolean;
    onCheck: (id: IReferenceData) => void;
    refFieldName: string;
  }) => {
    const { colors } = useTheme();
    const viewStyle = useMemo(() => [styles.item, { backgroundColor: colors.background }], [colors.background]);
    const textStyle = useMemo(() => [styles.name, { color: colors.text }], [colors.text]);

    return (
      <TouchableOpacity onPress={() => onCheck(item)}>
        <View style={viewStyle}>
          <Checkbox status={isChecked ? 'checked' : 'unchecked'} color={colors.primary} />
          <View style={styles.details}>
            <View style={styles.rowCenter}>
              <Text style={textStyle}>{item[refFieldName] || item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
