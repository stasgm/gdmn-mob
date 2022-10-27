import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl, StyleSheet } from 'react-native';
import { Searchbar, Divider, Chip } from 'react-native-paper';
import { RouteProp, useIsFocused, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import {
  AppScreen,
  ScanButton,
  ItemSeparator,
  globalStyles as styles,
  SearchButton,
  AppActivityIndicator,
  EmptyList,
  MediumText,
  LargeText,
  navBackButton,
  globalColors,
} from '@lib/mobile-ui';
import { docSelectors, refSelectors, useSelector } from '@lib/store';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IDocumentType } from '@lib/types';

import { formatValue, generateId } from '@lib/mobile-app';

import { StackNavigationProp } from '@react-navigation/stack';

import { getRemGoodListByContact } from '../../utils/helpers';
import { DocStackParamList } from '../../navigation/Root/types';
import { IMovementDocument } from '../../store/types';
import { IGood, IRemains, IRemGood } from '../../store/app/types';
import { DocLineDialog } from '../../components/DocLineDialog';

interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
}

const keyExtractor = (item: IRemGood) => String(item.good.id);

interface IProp {
  docId: string;
  item: IRemGood;
  onPressGood: (goodItem: IRemGood) => void;
}

const GoodRemains = ({ item, onPressGood, docId }: IProp) => {
  const { colors } = useTheme();
  const barcode = !!item.good.barcode;

  const doc = docSelectors.selectByDocId(docId) as IMovementDocument;
  const lines = doc?.lines?.filter((i) => i.good.id === item.good.id);
  const isAdded = !!lines?.length;

  const iconStyle = [styles.icon, { backgroundColor: isAdded ? '#06567D' : '#E91E63' }];
  const goodStyle = {
    backgroundColor: isAdded ? globalColors.backgroundLight : 'transparent',
  };

  const barcodeTextStyle = useMemo(
    () => [styles.number, styles.flexDirectionRow, { color: colors.text }],
    [colors.text],
  );

  const handlePressGood = useCallback(() => onPressGood(item), [item, onPressGood]);

  return (
    <TouchableOpacity onPress={handlePressGood}>
      <View style={[localStyles.goodItem, goodStyle]}>
        <View style={iconStyle}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>
            {item.good.alias ? `${item.good.name}, арт. ${item.good.alias}` : item.good.name}
          </LargeText>
          <View style={styles.directionRow}>
            <MediumText>
              {item.remains} {item.good.valueName} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}{' '}
              руб.
            </MediumText>
            {barcode && <Text style={barcodeTextStyle}>{item.good.barcode}</Text>}
          </View>
          {isAdded && (
            <View style={localStyles.lineView}>
              {lines.map((line) => (
                <Chip
                  key={line.id}
                  style={[localStyles.lineChip, { borderColor: colors.primary }]}
                  // onPress={() => setSelectedLine(line)}
                >
                  {line.quantity} шт.
                </Chip>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SelectRemainsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'SelectRemainsItem'>>();
  const { docId } = useRoute<RouteProp<DocStackParamList, 'SelectRemainsItem'>>().params;

  const { colors } = useTheme();
  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

  const [filterVisible, setFilterVisible] = useState(false);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

  // const docId = useRoute<RouteProp<DocStackParamList, 'SelectRemainsItem'>>().params?.docId;
  const document = useSelector((state) => state.documents.list).find((item) => item.id === docId) as IMovementDocument;

  const goods = refSelectors.selectByName<IGood>('good')?.data;
  const remains = refSelectors.selectByName<IRemains>('remains')?.data[0];
  const documentTypes = refSelectors.selectByName<IDocumentType>('documentType')?.data;

  const documentType = useMemo(
    () => documentTypes?.find((d) => d.id === document?.documentType.id),
    [document?.documentType.id, documentTypes],
  );

  const contactId = useMemo(
    () =>
      documentType?.remainsField === 'fromContact' ? document?.head?.fromContact?.id : document?.head?.toContact?.id,
    [document?.head?.fromContact?.id, document?.head?.toContact?.id, documentType?.remainsField],
  );

  const [goodRemains] = useState<IRemGood[]>(() =>
    contactId ? getRemGoodListByContact(goods, remains[contactId], documentType?.isRemains) : [],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    goodRemains,
  });

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          goodRemains,
        });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = isNaN(Number(lower))
          ? ({ good }: IRemGood) => good.name?.toLowerCase().includes(lower)
          : ({ good }: IRemGood) => good.barcode?.includes(searchQuery) || good.name?.toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery &&
          searchQuery.length > filteredList.searchQuery.length &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.goodRemains.filter(fn);
        } else {
          gr = goodRemains.filter(fn);
        }

        setFilteredList({
          searchQuery,
          goodRemains: gr,
        });
      }
    }
  }, [goodRemains, filteredList, searchQuery]);

  const handleScanner = useCallback(() => {
    navigation.navigate('ScanBarcode', { docId: docId });
  }, [navigation, docId]);

  const [selectedLine, setSelectedLine] = useState<IMovementLine | undefined>(undefined);
  const [selectedGood, setSelectedGood] = useState<IGood | undefined>(undefined);

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
        {isScanerReader && <ScanButton onPress={handleScanner} />}
      </View>
    ),
    [filterVisible, handleScanner, isScanerReader],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const refList = useRef<FlatList<IRemGood>>(null);
  useScrollToTop(refList);

  const pressGood = useCallback(
    (item: IRemGood) =>
      navigation.navigate('DocLine', {
        docId,
        mode: 0,
        item: {
          id: generateId(),
          good: { id: item.good.id, name: item.good.name },
          quantity: 0,
          remains: item.remains,
          price: item.price,
          buyingPrice: item.buyingPrice,
        },
      }),
    [docId, navigation],
  );

  const hadndleDismissDialog = () => {
    setSelectedLine(undefined);
    setSelectedGood(undefined);
  };

  const renderItem = ({ item }: { item: IRemGood }) => (
    <GoodRemains item={item} docId={docId} onPressGood={pressGood} />
  );

  const RC = useMemo(() => <RefreshControl refreshing={!goodRemains} title="загрузка данных..." />, [goodRemains]);

  // const isFocused = useIsFocused();
  // if (!isFocused) {
  //   return <AppActivityIndicator />;
  // }

  return (
    <AppScreen>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск (штрихкод, наименование)"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.flexGrow, styles.searchBar]}
              autoFocus
              selectionColor={searchStyle}
              keyboardType="url"
            />
          </View>
          <ItemSeparator />
        </>
      )}
      <FlatList
        ref={refList}
        data={filteredList.goodRemains}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={RC}
        ListEmptyComponent={EmptyList}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
        keyboardShouldPersistTaps="handled"
      />
      {(selectedLine || selectedGood) && (
        <DocLineDialog
          selectedLine={selectedLine}
          goodName={selectedLine?.good.name || selectedGood?.name || ''}
          onEditLine={handleEditLine}
          onAddLine={handleAddLine}
          onDeleteLine={handleDeleteLine}
          onDismissDialog={hadndleDismissDialog}
        />
      )}
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  goodItem: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 3,
    minHeight: 50,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  lineView: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  lineChip: {
    margin: 2,
  },
});
