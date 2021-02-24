import { useScrollToTop, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Searchbar, Checkbox, Paragraph } from 'react-native-paper';

import { HeaderRight } from '../../../../components/HeaderRight';
import ItemSeparator from '../../../../components/ItemSeparator';
import SubTitle from '../../../../components/SubTitle';
import { IListItem } from '../../../../model/types';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../../store';

type Props = StackScreenProps<DocumentStackParamList, 'SelectItem'>;

export const SelectItemScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const { state, actions } = useAppStore();

  const { list, isMulti = false, formName, fieldName, title, value } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IListItem[]>(undefined);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);

  useEffect(() => {
    setCheckedItem(value);
  }, [searchQuery, value]);

  useEffect(() => {
    if (!list) {
      return;
    }
    setFilteredList(list.filter((i) => i.value.toUpperCase().includes(searchQuery.toUpperCase())));
  }, [list, searchQuery]);

  const refList = React.useRef<FlatList<IListItem>>(null);
  useScrollToTop(refList);

  const selectItem = useCallback(
    (id: number) => {
      setCheckedItem((prev) => (isMulti ? [...prev, id] : [id]));
    },
    [isMulti],
  );

  const renderItem = useCallback(
    ({ item }: { item: IListItem }) => {
      return (
        <LineItem
          item={item}
          // eslint-disable-next-line eqeqeq
          checked={Array.isArray(checkedItem) ? checkedItem?.includes(item.id) : checkedItem == item.id}
          onSelect={selectItem}
        />
      );
    },
    [checkedItem, selectItem],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.setOptions({ animationTypeForReplace: 'push' });
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            if (!checkedItem) {
              Alert.alert('Ошибка!', 'Необходимо выбрать элемент.', [{ text: 'OK' }]);
              return;
            }

            // console.log('formName', formName);
            // console.log('isMulti', isMulti);
            actions.setForm({
              [formName]: {
                ...state.forms[formName],
                [fieldName]: isMulti ? checkedItem : Array.isArray(checkedItem) ? checkedItem[0] : checkedItem,
              },
            });
            navigation.goBack();
          }}
        />
      ),
    });
  }, [actions, checkedItem, fieldName, formName, isMulti, navigation, state.forms]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{title}</SubTitle>
      <ItemSeparator />
      <Searchbar placeholder="Поиск" onChangeText={setSearchQuery} value={searchQuery} style={localStyles.searchBar} />
      <ItemSeparator />
      <FlatList
        ref={refList}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

const LineItem = React.memo(
  ({ item, checked, onSelect }: { item: IListItem; checked: boolean; onSelect: (id: number) => void }) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity onPress={() => onSelect(item.id)}>
        <View style={localStyles.row}>
          <Paragraph style={localStyles.details}>{item.value}</Paragraph>
          <Checkbox color={colors.primary} status={checked ? 'checked' : 'unchecked'} />
        </View>
      </TouchableOpacity>
    );
  },
);

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  details: {
    flex: 9,
    margin: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
});
