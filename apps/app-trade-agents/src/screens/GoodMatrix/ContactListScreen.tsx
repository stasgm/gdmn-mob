import { AppScreen, DrawerButton, globalStyles as styles, ItemSeparator, SubTitle } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionList, SectionListData, View, Text } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGoodMatrix } from '../../store/types';
import { getDateString } from '../../utils/helpers';

import ContactItem from './components/ContactItem';

export type RefListItem = IReference & { refName: string };

export interface ContactListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IContact, ContactListSectionProps>[];

const ContactListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<GoodMatrixStackParamList, 'ContactList'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data;

  const contacts = refSelectors
    .selectByName<IContact>('contact')
    ?.data.filter((i) => i.id === goodMatrix?.find((item) => item.contactId === i.id)?.contactId);

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
        const matrixDate = goodMatrix.find((i) => i.contactId === item.id)?.onDate;
        const sectionTitle = matrixDate ? getDateString(matrixDate) : '';
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
    [filteredList, goodMatrix],
  );

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => (
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
      ),
    });
  }, [colors.card, filterVisible, navigation]);

  const renderItem = ({ item }: { item: IContact }) => <ContactItem item={item} />;

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
              // eslint-disable-next-line react/no-children-prop
              children={undefined}
              autoComplete={undefined}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        keyExtractor={({ id }) => id}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => (
          <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
        )}
        scrollEventThrottle={400}
        onEndReached={() => ({})}
        ListEmptyComponent={!contacts || !goodMatrix ? <Text style={styles.emptyList}>Список пуст</Text> : null}
      />
    </AppScreen>
  );
};

export default ContactListScreen;
