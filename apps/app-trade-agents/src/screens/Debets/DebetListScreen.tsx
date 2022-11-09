import { keyExtractor, useSendOneRefRequest } from '@lib/mobile-hooks';
import { IListItem } from '@lib/mobile-types';
import {
  AppActivityIndicator,
  AppScreen,
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  LargeText,
  Menu,
  navBackDrawer,
  SearchButton,
  SubTitle,
} from '@lib/mobile-ui';
import { refSelectors, useSelector } from '@lib/store';
import { IReference } from '@lib/types';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, SectionListData, View, StyleSheet } from 'react-native';
import { Button, Dialog, Divider, Searchbar } from 'react-native-paper';

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

  const handlePressItem = useCallback(
    (id: string) => {
      if (!loading) {
        setContactId(id);
        setVisibleDialog(true);
      }
    },
    [loading],
  );

  const renderItem = useCallback(
    ({ item }: { item: IDebt }) => <DebetItem item={item} onPress={() => handlePressItem(item.id)} />,
    [handlePressItem],
  );

  const sendRequest = useSendOneRefRequest('Дебиторская задолженность', { name: 'debt', contactId });

  const handleSendDebtRequest = async () => {
    if (sendRequest) {
      await sendRequest();
    }
    setVisibleDialog(false);
  };

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
      <FlatList
        data={filteredList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={!debets ? EmptyList : null}
        keyboardShouldPersistTaps={'handled'}
      />
      <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
        <Dialog.Title>Внимание!</Dialog.Title>
        <Dialog.Content>
          <LargeText>
            {
              'Отправить запрос на получение дебиторской задолженности?\n\nВыполнение запроса может занять некоторое время.'
            }
          </LargeText>
        </Dialog.Content>
        <Dialog.Actions style={localStyles.action}>
          <Button color={colors.primary} onPress={handleSendDebtRequest} disabled={loading}>
            Отправить
          </Button>
          <Button color={colors.primary} onPress={() => setVisibleDialog(false)}>
            Отмена
          </Button>
        </Dialog.Actions>
      </Dialog>
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default DebetListScreen;
