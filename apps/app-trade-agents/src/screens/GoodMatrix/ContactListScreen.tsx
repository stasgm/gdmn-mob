import { DrawerButton, globalStyles as styles, ItemSeparator } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

import { GoodMatrixStackParamList } from '../../navigation/Root/types';
import { IContact, IGoodMatrix } from '../../store/types';

import ContactItem from './components/ContactItem';

export type RefListItem = IReference & { refName: string };

const ContactListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<GoodMatrixStackParamList, 'ContactList'>>();
  const [searchQuery, setSearchQuery] = useState('');

  const [filterVisible, setFilterVisible] = useState(false);
  const { colors } = useTheme();

  // const { loading } = useSelector((state) => state.documents);
  // const { list } = useSelector((state) => state.references);

  // const refData = useMemo(() => {
  //   return Object.entries(list)
  //     .map(([key, value]) => ({ ...value, refName: key } as RefListItem))
  //     .filter((i) => i.visible !== false);
  // }, [list]);

  // console.log('ref', refData);

  const contacts = refSelectors.selectByName<IContact>('contact')?.data;
  const goodMatrix = refSelectors.selectByName<IGoodMatrix>('goodMatrix')?.data;

  console.log('çontacts', contacts);
  console.log('matrix', goodMatrix);
  const handleAddDocument = useCallback(() => {
    navigation.navigate('ContactView');
  }, [navigation]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  ////////////////////////////
  //SEARCH/////
  ////////////////////////////
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
  }, [colors.card, filterVisible, handleAddDocument, navigation]);

  const renderItem = ({ item }: { item: any }) => {
    const a = contacts.find((i) => i.id === item.id);
    console.log('1234567', a);
    return <ContactItem item={a} />;
  };
  // };

  return (
    <>
      <View>
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
          data={contacts}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          scrollEventThrottle={400}
          ItemSeparatorComponent={ItemSeparator}
        />
        <Text>123</Text>
      </View>
    </>
  );
};

export default ContactListScreen;
