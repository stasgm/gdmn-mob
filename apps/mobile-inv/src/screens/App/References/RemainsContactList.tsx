import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

import { IMDGoodRemain, IRefData } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { useAppStore } from '../../../store';

interface IField {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

const RemainsContactListViewScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { state: appState } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IRefData[]>();

  const LineItem = useCallback(
    ({ item }: { item: IField }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RemainsView', { item });
          }}
        >
          <View style={[localStyles.item, { backgroundColor: colors.card }]}>
            <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
            </View>
            <View style={localStyles.details}>
              <Text style={[localStyles.name, { color: colors.text }]}>{item.name ?? item.id}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [colors.card, colors.primary, colors.text, navigation],
  );

  useEffect(() => {
    const remains = appState.models?.remains;

    if (!remains) {
      return;
    }

    const contactList: IRefData[] = Object.keys(remains.data)
      .map((el) => ({ id: Number(el), name: (remains.data[el] as IMDGoodRemain).contactName }))
      .filter((el) => el.name.includes(searchQuery.toUpperCase()))
      .sort((a, b) => (a.name < b.name ? -1 : 1));

    setFilteredList(contactList);
  }, [appState.models?.remains, searchQuery]);

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <LineItem item={item} />;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[localStyles.content, { backgroundColor: colors.card }]}>
        <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>
          {appState.references?.contacts?.name}
        </SubTitle>
        <ItemSeparator />
        <View style={localStyles.flexDirectionRow}>
          <Searchbar
            placeholder="Поиск"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[localStyles.flexGrow, localStyles.searchBar]}
          />
        </View>
        <ItemSeparator />
        <FlatList
          ref={ref}
          data={filteredList}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export { RemainsContactListViewScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    height: '100%',
  },
  details: {
    margin: 10,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
});
