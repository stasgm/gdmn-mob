import React, { useCallback, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { ListRenderItem, RefreshControl, SectionList, SectionListData, Text, View, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import { Divider, IconButton, Searchbar } from 'react-native-paper';

import { useSelector } from '@lib/store';
import {
  globalStyles as styles,
  AddButton,
  FilterButtons,
  ItemSeparator,
  Status,
  AppScreen,
  SubTitle,
  ScreenListItem,
  IListItemProps,
} from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { getDateString } from '@lib/mobile-app';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IOrderDocument } from '../../store/types';
import SwipeListItem from '../../components/SwipeListItem';
import { OrdersStackParamList } from '../../navigation/Root/types';
import { navBackDrawer } from '../../components/navigateOptions';

export interface OrderListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const OrderListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList, 'OrderList'>>();

  const loading = useSelector((state) => state.documents.loading);
  const orders = useSelector((state) => state.documents.list) as IOrderDocument[];
  const { colors } = useTheme();

  const searchStyle = useMemo(() => colors.primary, [colors.primary]);
  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);
  const textStyle1 = useMemo(() => [{ fontSize: 16 }, { color: colors.text }], [colors.text]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const list = orders
    ?.filter((i) =>
      i.documentType?.name === 'order'
        ? i?.head?.contact.name || i?.head?.outlet.name || i.number || i.documentDate || i.head.onDate
          ? i?.head?.contact?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i?.head?.outlet?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
            i.number.toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.documentDate).toUpperCase().includes(searchQuery.toUpperCase()) ||
            getDateString(i.head.onDate).toUpperCase().includes(searchQuery.toUpperCase())
          : true
        : false,
    )
    .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const [status, setStatus] = useState<Status>('all');

  const filteredList: IListItemProps[] = useMemo(() => {
    const res =
      status === 'all'
        ? list
        : status === 'active'
        ? list.filter((e) => e.status !== 'PROCESSED')
        : status === 'archive'
        ? list.filter((e) => e.status === 'PROCESSED')
        : [];

    return res.map(
      (i) =>
        ({
          id: i.id,
          title: i.head.outlet?.name,
          documentDate: getDateString(i.documentDate),
          status: i.status,
          subtitle: `№ ${i.number} от ${getDateString(i.documentDate)} на ${getDateString(i.head?.onDate)}`,
          isFromRoute: !!i.head.route,
          lineCount: i.lines.length,
          errorMessage: i.errorMessage,
        } as IListItemProps),
    );
  }, [status, list]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = item.documentDate;
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
            // key: [item].length,
          },
        ];
      }, []),
    [filteredList],
  );

  const handleAddDocument = useCallback(() => {
    navigation.navigate('OrderEdit');
  }, [navigation]);

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <IconButton
          icon="card-search-outline"
          style={filterVisible && { backgroundColor: colors.card }}
          size={26}
          onPress={() => setFilterVisible((prev) => !prev)}
        />
        <AddButton onPress={handleAddDocument} />
      </View>
    ),
    [colors.card, filterVisible, handleAddDocument],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    const doc = list.find((r) => r.id === item.id);
    return doc ? (
      <SwipeListItem renderItem={item} item={doc} routeName="OrderView">
        <ScreenListItem {...item} onSelectItem={() => navigation.navigate('OrderView', { id: item.id })} />
      </SwipeListItem>
    ) : null;
  };

  return (
    <AppScreen>
      <FilterButtons status={status} onPress={setStatus} style={styles.marginBottom5} />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={searchStyle}
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section }) => (
          <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
        )}
        refreshControl={<RefreshControl refreshing={loading} title="загрузка данных..." />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyList}>Список пуст</Text> : null}
        // renderSectionFooter={() =>
        //   status === 'all' ? (
        //     <View style={styles.total}>
        //       <Divider />
        //       <View style={styles.directionRow}>
        //         {/* <Text style={textStyle}>Количество принятых заявок: {sections.}</Text> */}
        //         {/* <Text style={textStyle}>{sections.map((i) => i.).length}</Text> */}
        //       </View>
        //       <View style={styles.directionRow}>
        //         <Text style={textStyle}>Количество одобренных заявок:</Text>
        //         {/* <Text style={textStyle}>{processedList}</Text> */}
        //       </View>
        //     </View>
        // ) : null
        // }
        renderSectionFooter={(item) =>
          status === 'all' ? (
            // <Text>{section.section.data.length}</Text>
            <View style={{ backgroundColor: '#edebeb' }} /*style={[styles.total /*, localStyles.header*]}*/>
              <Divider style={{ backgroundColor: colors.primary }} />
              <View style={[localStyles.header, { alignItems: 'center' }]}>
                <View style={[styles.icon, { backgroundColor: colors.primary /*'#06567D'*/ }]}>
                  <MaterialCommunityIcons name="percent-outline" size={20} color={'#FFF'} />
                </View>
                <View style={{ flexDirection: 'column', margin: 5 }}>
                  {/* <View style={styles.directionRow}> */}
                  <Text style={textStyle1}>Количество принятых заявок: {item.section.data.length}</Text>
                  {/* </View> */}
                  {/* <View style={styles.directionRow}> */}
                  <Text style={textStyle1}>
                    Количество одобренных заявок: {item.section.data.filter((i) => i.status === 'PROCESSED').length}
                  </Text>
                  {/* </View> */}
                </View>
              </View>
            </View>
          ) : null
        }
      />
    </AppScreen>
  );
};

export default OrderListScreen;

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    // backgroundColor: '#e1e1e1',
    backgroundColor: '#edebeb',
    // justifyContent: 'space-around',
    margin: 3,
    paddingVertical: 6,
  },
});
