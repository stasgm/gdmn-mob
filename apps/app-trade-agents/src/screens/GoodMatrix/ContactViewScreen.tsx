import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGood, IGoodMatrix, IMatrixDataNamed } from '../../store/types';

import GoodItem from './components/GoodItem';

const ContactViewScreen = () => {
  const { id } = useRoute<RouteProp<GoodMatrixStackParamList, 'ContactView'>>().params;
  const contact = refSelectors.selectByName<IContact>('contact')?.data.find((e) => e.id === id);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data.find((item) => item.contactId === id);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();

  const goods = refSelectors.selectByName<IGood>('good')?.data;

  const filteredList = useMemo(() => {
    const res = goodMatrix?.data;
    const list = res?.map((item) => {
      const name = goods.find((i) => i.id === item.goodId)?.name;
      return {
        ...item,
        goodName: name,
      } as IMatrixDataNamed;
    });
    return (
      list
        ?.filter((i) => (i.goodName ? i.goodName.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        ?.sort((a, b) => (a.goodName < b.goodName ? -1 : 1)) || []
    );
  }, [goodMatrix?.data, goods, searchQuery]);

  console.log('filterre', filteredList);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => (
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
      ),
    });
  }, [navigation, filterVisible, colors.card]);

  const renderItem = ({ item }: { item: IMatrixDataNamed }) => {
    const good = filteredList?.find((i) => i.goodId === item.goodId);
    return <GoodItem contactId={contact?.id} item={good} />;
  };

  console.log('search', searchQuery);

  return (
    <>
      <SubTitle style={[styles.title]}>{contact?.name}</SubTitle>
      <View style={[styles.content]}>
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
        <FlatList
          data={filteredList}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          scrollEventThrottle={400}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </>
  );
};

export default ContactViewScreen;
