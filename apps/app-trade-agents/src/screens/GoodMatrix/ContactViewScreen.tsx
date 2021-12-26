import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from '@lib/mobile-navigation';
import { IconButton, Searchbar } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { BackButton, ItemSeparator, SubTitle } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGoodMatrix } from '../../store/types';
import GoodItem from './components/GoodItem';

const ContactViewScreen = () => {
  const { id } = useRoute<RouteProp<GoodMatrixStackParamList, 'ContactView'>>().params;
  const contact = refSelectors.selectByName<IContact>('contact')?.data.find((e) => e.id === id);

  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data.find((item) => item.contactId === id);

  console.log('contac', contact);
  console.log('good', goodMatrix);

  const [searchQuery, setSearchQuery] = useState('');

  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();
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

  const renderItem = ({ item }: { item: any /*IReturnLine*/ }) => {
    const good = goodMatrix?.data.find((i) => i.goodId === item.goodId);
    return <GoodItem contactId={contact?.id} item={good} />;
  };

  return (
    <>
      <SubTitle style={[styles.title]}>{contact?.name}</SubTitle>
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
        data={goodMatrix?.data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        scrollEventThrottle={400}
        ItemSeparatorComponent={ItemSeparator}
      />

      <View>
        <Text>123</Text>
      </View>
    </>
  );
};

export default ContactViewScreen;
