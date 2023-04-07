import { keyExtractor, useSendOneRefRequest } from '@lib/mobile-hooks';
import { IListItem } from '@lib/mobile-types';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  Menu,
  navBackDrawer,
  SearchButton,
  SimpleDialog,
  SubTitle,
} from '@lib/mobile-ui';
import { refSelectors, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';

import { DebetStackParamList } from '../../navigation/Root/types';
import { IDebt } from '../../store/types';
import { debetTypes } from '../../utils/constants';

import DebetItem from './components/DebetItem';

export type RefListItem = IReference & { refName: string };

export interface DebetListSectionProps {
  title: string;
}

export type SectionDataProps = SectionListData<IDebt, DebetListSectionProps>[];

const DebetListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DebetStackParamList, 'DebetList'>>();
  const loading = useSelector((state) => state.app.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [visibleType, setVisibleType] = useState(false);
  const [debetType, setDebetType] = useState(debetTypes[0]);
  const [contactId, setContactId] = useState<string | undefined>();

  const [visibleDialog, setVisibleDialog] = useState(false);

  const { colors } = useTheme();

  const debets = refSelectors.selectByName<IDebt>('debt')?.data;

  const handleApplyType = (option: IListItem) => {
    setVisibleType(false);
    setDebetType(option);
  };

  //Фильтруем по названию клиента и по типу дебеторки
  const filteredList = useMemo(
    () =>
      debets
        ?.filter(
          (i) =>
            ((debetType.id === 'credit' && i.saldo > 0) ||
              (debetType.id === 'debet' && i.saldo <= 0) ||
              (debetType.id === 'minus' && i.saldoDebt > 0) ||
              debetType.id === 'all') &&
            (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true),
        )
        ?.sort((a, b) => (a.name < b.name ? -1 : 1)) || [],
    [debetType.id, debets, searchQuery],
  );

  useEffect(() => {
    if (!filterVisible && searchQuery) {
      setSearchQuery('');
    }
  }, [filterVisible, searchQuery]);

  const renderRight = useCallback(
    () => <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />,
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const handlePressItem = useCallback((id: string) => {
    setContactId(id);
    setVisibleDialog(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IDebt }) => <DebetItem item={item} onPress={() => handlePressItem(item.id)} />,
    [handlePressItem],
  );

  const sendRequest = useSendOneRefRequest('Дебиторская задолженность', { name: 'debt', contactId });

  const handleSendDebtRequest = useCallback(async () => {
    setVisibleDialog(false);
    await sendRequest();
  }, [sendRequest]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  return (
    <AppScreen>
      <View style={[styles.rowCenter, styles.containerCenter]}>
        <SubTitle style={styles.title}>{debetType.value}</SubTitle>
        <Menu
          key={'MenuType'}
          visible={visibleType}
          onChange={handleApplyType}
          onDismiss={() => setVisibleType(false)}
          onPress={() => setVisibleType(true)}
          options={debetTypes}
          activeOptionId={debetType.id}
          iconSize={26}
          iconName={'menu-down'}
        />
      </View>
      <Divider />
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
      <FlashList
        data={filteredList}
        renderItem={renderItem}
        estimatedItemSize={60}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
        ListEmptyComponent={!debets ? EmptyList : null}
      />
      <SimpleDialog
        visible={visibleDialog}
        title={'Внимание!'}
        text={'Отправить запрос на получение дебиторской задолженности?'}
        onCancel={() => setVisibleDialog(false)}
        onOk={handleSendDebtRequest}
        okDisabled={loading}
      />
    </AppScreen>
  );
};

export default DebetListScreen;
