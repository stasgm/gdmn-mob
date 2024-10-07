import { styles } from './styles';
import ReferenceItem from './components/ReferenceItem';
import { ReferenceStackParamList } from '../../navigation/Root/types';
import React, { useState, useMemo, useLayoutEffect, useEffect, useCallback } from 'react';
import { Divider, Searchbar } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { SubTitle, ItemSeparator, SearchButton, AppScreen, navBackButton } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';
import { INamedEntity } from '@lib/types';

import { keyExtractorByIndex } from '@lib/mobile-hooks';

import { FlashList } from '@shopify/flash-list';

const ReferenceViewScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const refName = useRoute<RouteProp<ReferenceStackParamList, 'ReferenceView'>>().params?.name;

  const list = refSelectors.selectByName<INamedEntity>(refName);

  const filteredList = useMemo(() => {
    return (
      list?.data
        .filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || []
    );
  }, [list, searchQuery]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const headerRight = useCallback(
    () => <SearchButton visible={filterVisible} onPress={() => setFilterVisible((prev) => !prev)} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight,
    });
  }, [navigation, filterVisible, headerRight]);

  if (!list) {
    return (
      <AppScreen>
        <SubTitle style={styles.title}>Справочник не найден</SubTitle>
      </AppScreen>
    );
  }

  const renderItem = ({ item }: { item: INamedEntity }) => <ReferenceItem item={item} refName={refName} />;

  return (
    <AppScreen>
      <SubTitle style={[styles.title]}>{list?.description || list.name}</SubTitle>
      {filterVisible && (
        <>
          <Searchbar
            placeholder="Поиск"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            autoFocus
            selectionColor="green"
          />
          <ItemSeparator />
        </>
      )}
      <FlashList
        data={filteredList}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={Divider}
        keyExtractor={keyExtractorByIndex}
        keyboardShouldPersistTaps={'handled'}
      />
    </AppScreen>
  );
};

export default ReferenceViewScreen;
