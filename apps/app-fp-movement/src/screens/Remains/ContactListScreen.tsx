import { getDateString, keyExtractor, useSendOneRefRequest } from '@lib/mobile-hooks';
import {
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  navBackDrawer,
  SearchButton,
  SubTitle,
  useActionSheet,
  MenuButton,
} from '@lib/mobile-ui';
import { refSelectors, useSelector } from '@lib/store';
import { IDepartment, IReference } from '@lib/types';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionList, SectionListData, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

import { RemainsStackParamList } from '../../navigation/Root/types';
import { IEmployee, IRemains } from '../../store/app/types';

import ContactItem from './components/ContactItem';

export type RefListItem = IReference & { refName: string };

export interface ContactListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IDepartment | IEmployee, ContactListSectionProps>[];

const ContactListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RemainsStackParamList, 'ContactList'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const showActionSheet = useActionSheet();

  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];
  const department = refSelectors.selectByName<IDepartment>('depart')?.data || [];
  const employee = refSelectors.selectByName<IEmployee>('employee')?.data || [];
  const contacts = department?.concat(employee)?.filter((i) => remains?.[i.id]);

  const syncDate = useSelector((state) => state.app.syncDate);

  const filteredList = useMemo(() => {
    return (
      contacts
        ?.filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [contacts, searchQuery]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = syncDate ? getDateString(syncDate) : getDateString(new Date());
        const sectionExists = prev.some(({ title }) => title === sectionTitle);
        if (sectionExists) {
          return prev.map((section) =>
            section.title === sectionTitle ? { ...section, data: [...section.data, item] } : section,
          );
        }

        return [
          ...prev,
          {
            title: sectionTitle,
            data: [item],
          },
        ];
      }, []),
    [filteredList, syncDate],
  );

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const sendRequest = useSendOneRefRequest('Остатки', { name: 'remains' });

  const handleSendRequest = useCallback(async () => {
    await sendRequest();
  }, [sendRequest]);

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Запросить справочник остатков',
        onPress: handleSendRequest,
      },

      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [handleSendRequest, showActionSheet]);
  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />

        <MenuButton actionsMenu={actionsMenu} />
      </View>
    ),
    [actionsMenu, filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem = ({ item }: { item: IDepartment | IEmployee }) => <ContactItem item={item} />;

  const renderSectionHeader = useCallback(
    ({ section }: any) => <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>,
    [],
  );

  return (
    <AppScreen>
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
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={renderSectionHeader}
        scrollEventThrottle={400}
        ListEmptyComponent={!contacts || !remains ? EmptyList : null}
      />
    </AppScreen>
  );
};

export default ContactListScreen;
