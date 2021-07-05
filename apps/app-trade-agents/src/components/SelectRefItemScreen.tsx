import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, FlatList, Alert, TouchableOpacity, Text } from 'react-native';
import { Searchbar, Divider, useTheme, Checkbox } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useScrollToTop } from '@react-navigation/native';

import { INamedEntity, IReference } from '@lib/types';
import { refSelectors } from '@lib/store';

import {
  AppScreen,
  BackButton,
  ItemSeparator,
  SaveButton,
  SearchButton,
  SubTitle,
  globalStyles as styles,
} from '@lib/mobile-ui';

import { useDispatch, useSelector } from '../store';
import { appActions } from '../store/app/actions';
import { IOutlet } from '../store/docs/types';
import { extraPredicate } from '../utils/helpers';
import { IFormParam } from '../store/app/types';
import { RefParamList } from '../navigation/Root/types';

const SelectRefItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { refName, isMulti, fieldName, value, clause } = useRoute<RouteProp<RefParamList, 'SelectRefItem'>>().params;

  const refObj = refSelectors.selectByName(refName) as IReference<any>;

  const list = useMemo(() => {
    if (clause && refObj?.data) {
      return refObj?.data.filter((item) => {
        const newParams = Object.assign({}, clause);

        let companyFound = true;

        // clause = { type: 'shop', name: 'Раница', company: { id: 1} }
        // if ('companyId' in newParams && refName === 'outlet') {
        /*         const params: Record<string, string> = {};
                Object.keys(clause).forEach((i) => {
                  if (i in item) {
                    if (typeof clause[i] !== 'object') {
                      params[i] = clause[i];
                    }
                  }
                });
                 */
        Object.keys(clause).forEach((i) => {
          if (i in item) {
            if (typeof clause[i] !== 'object' && typeof item[i] !== 'object' && item[i] === clause[i]) {
            }
          }
        });
        // params = { name: 'Раница' }
        companyFound = (item as IOutlet).company.id.includes(newParams.companyId);
        delete newParams.companyId;
        // }

        return companyFound && extraPredicate(item, newParams);
      });
    }
    return refObj?.data;
  }, [clause, refObj?.data]);

  const title = refObj?.name;

  const formParams = useSelector((state) => state.app.formParams);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredList, setFilteredList] = useState<INamedEntity[]>();
  const [checkedItem, setCheckedItem] = useState<INamedEntity[]>(value || []);

  useEffect(() => {
    if (!list) {
      return;
    }
    setFilteredList(
      list
        .filter((i) => i?.name?.toUpperCase().includes(searchQuery.toUpperCase()))
        .sort((a) => {
          return checkedItem?.find((v) => v.id === a.id) ? -1 : 1;
        }),
    );
  }, [checkedItem, isMulti, list, searchQuery, value]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const refList = React.useRef<FlatList<INamedEntity>>(null);
  useScrollToTop(refList);

  const handleSelectItem = useCallback(
    (item: INamedEntity) => {
      if (isMulti) {
        setCheckedItem((prev) => [...(prev as INamedEntity[]), { id: item.id, name: item.name }]);
      } else {
        dispatch(
          appActions.setFormParams({
            ...formParams,
            [fieldName]: { id: item.id, name: item.name },
          }),
        );
        navigation.goBack();
      }
    },
    [isMulti, dispatch, formParams, fieldName, navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: INamedEntity }) => {
      const isChecked = !!checkedItem?.find((i) => i.id === item.id);
      return <LineItem item={item} isChecked={isChecked} onCheck={handleSelectItem} />;
    },
    [checkedItem, handleSelectItem],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <View style={styles.buttons}>
          <SearchButton visible={filterVisible} onPress={() => setFilterVisible((prev) => !prev)} />
          {isMulti && (
            <SaveButton
              onPress={() => {
                if (!checkedItem) {
                  Alert.alert('Ошибка!', 'Необходимо выбрать элемент.', [{ text: 'OK' }]);
                  return;
                }
                const newFormParams: IFormParam = {
                  ...formParams,
                  [fieldName]: checkedItem,
                };
                dispatch(appActions.setFormParams(newFormParams));
                navigation.goBack();
              }}
            />
          )}
        </View>
      ),
    });
  }, [checkedItem, fieldName, isMulti, navigation, formParams, filterVisible, dispatch]);

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
  ({ item, isChecked, onCheck }: { item: INamedEntity; isChecked: boolean; onCheck: (id: INamedEntity) => void }) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity onPress={() => onCheck(item)}>
        <View style={[styles.item, { backgroundColor: colors.background }]}>
          <Checkbox status={isChecked ? 'checked' : 'unchecked'} color={colors.primary} />
          <View style={styles.details}>
            <View style={styles.rowCenter}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name || item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default SelectRefItemScreen;
