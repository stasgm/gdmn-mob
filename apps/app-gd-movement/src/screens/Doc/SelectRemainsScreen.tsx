import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Alert } from 'react-native';
import { Searchbar, Divider, Chip } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute, useScrollToTop, useTheme } from '@react-navigation/native';

import {
  AppScreen,
  ScanButton,
  ItemSeparator,
  globalStyles as styles,
  SearchButton,
  EmptyList,
  MediumText,
  LargeText,
  navBackButton,
  globalColors,
} from '@lib/mobile-ui';
import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { IDocumentType } from '@lib/types';

import { formatValue, generateId } from '@lib/mobile-hooks';

import { StackNavigationProp } from '@react-navigation/stack';

import { getRemGoodListByContact } from '../../utils/helpers';
import { DocStackParamList } from '../../navigation/Root/types';
import { IMovementDocument, IMovementLine } from '../../store/types';
import { IGood, IRemains, IRemGood } from '../../store/app/types';

import { DocLineDialog } from './components/DocLineDialog';

interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
}

const keyExtractor = (item: IRemGood) => String(item.good.id);

export const SelectRemainsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DocStackParamList, 'SelectRemainsItem'>>();
  const { docId } = useRoute<RouteProp<DocStackParamList, 'SelectRemainsItem'>>().params;

  const dispatch = useDispatch();

  const { colors } = useTheme();
  const searchStyle = useMemo(() => colors.primary, [colors.primary]);

  const [filterVisible, setFilterVisible] = useState(false);

  const isScanerReader = useSelector((state) => state.settings?.data?.scannerUse?.data);

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
          : ({ good }: IRemGood) =>
              good.barcode?.includes(searchQuery) ||
              good.name?.toLowerCase().includes(lower) ||
              good.weightCode?.toLowerCase().includes(lower) ||
              good.alias?.toLowerCase().includes(lower);

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
  const [selectedGood, setSelectedGood] = useState<IRemGood | undefined>(undefined);

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

  const handleAddLine = useCallback(
    (item?: IRemGood) => {
      if (selectedLine) {
        navigation.navigate('DocLine', {
          docId,
          mode: 0,
          item: {
            id: generateId(),
            good: { id: selectedLine.good.id, name: selectedLine.good.name },
            quantity: 0,
            remains: selectedLine.remains,
            price: selectedLine.price,
            buyingPrice: selectedLine.buyingPrice,
          },
        });
        setSelectedLine(undefined);
      } else if (selectedGood) {
        navigation.navigate('DocLine', {
          docId,
          mode: 0,
          item: {
            id: generateId(),
            good: selectedGood.good,
            quantity: 0,
            remains: selectedGood.remains,
            price: selectedGood.price,
            buyingPrice: selectedGood.buyingPrice,
          },
        });
        setSelectedGood(undefined);
      } else if (item) {
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
        });
      }
    },
    [docId, navigation, selectedGood, selectedLine],
  );

  const handleEditLine = useCallback(() => {
    if (selectedLine) {
      navigation.navigate('DocLine', {
        docId,
        mode: 1,
        item: selectedLine,
      });
      setSelectedLine(undefined);
    }
  }, [docId, navigation, selectedLine]);

  const handleDeleteLine = useCallback(() => {
    if (selectedLine) {
      Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocumentLine({ docId, lineId: selectedLine.id }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
      setSelectedLine(undefined);
    } else if (selectedGood && document) {
      const lineIds: string[] = document.lines?.filter((i) => i.good.id === selectedGood?.good.id)?.map((i) => i.id);
      Alert.alert(`Вы уверены, что хотите удалить ${lineIds.length > 1 ? 'все позиции' : 'позицию'} ?`, '', [
        {
          text: 'Да',
          onPress: () => {
            dispatch(documentActions.removeDocumentLines({ docId, lineIds }));
          },
        },
        {
          text: 'Отмена',
        },
      ]);
      setSelectedGood(undefined);
    }
  }, [dispatch, docId, document, selectedGood, selectedLine]);

  const hadndleDismissDialog = () => {
    setSelectedLine(undefined);
    setSelectedGood(undefined);
  };

  const GoodRemains = useCallback(
    ({ item }: { item: IRemGood }) => {
      const barcode = !!item.good.barcode;

      const doc = docSelectors.selectByDocId(docId) as IMovementDocument;
      const lines = doc?.lines?.filter((i) => i.good.id === item.good.id);
      const isAdded = !!lines?.length;

      const iconStyle = [styles.icon, { backgroundColor: isAdded ? '#06567D' : '#E91E63' }];
      const goodStyle = {
        backgroundColor: isAdded ? globalColors.backgroundLight : 'transparent',
      };

      return (
        <TouchableOpacity
          onPress={() => {
            if (isAdded) {
              setSelectedGood(item);
            } else {
              handleAddLine(item);
            }
          }}
        >
          <View style={[localStyles.goodItem, goodStyle]}>
            <View style={iconStyle}>
              <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
            </View>
            <View style={styles.details}>
              <LargeText style={styles.textBold}>{item.good.name}</LargeText>
              <View style={styles.directionRow}>
                <MediumText>
                  {item.remains} {item.good.valueName} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}{' '}
                  руб.
                </MediumText>
                {barcode && (
                  <MediumText style={[styles.number, styles.flexDirectionRow]}>{item.good.barcode}</MediumText>
                )}
              </View>

              {item.good.alias && item.good.weightCode ? (
                <MediumText style={[styles.number, styles.flexDirectionRow]}>
                  арт. {item.good.alias}, вес. код {item.good.weightCode}
                </MediumText>
              ) : item.good.alias ? (
                <MediumText style={styles.number}>арт. {item.good.alias}</MediumText>
              ) : item.good.weightCode ? (
                <MediumText style={styles.number}>вес. код {item.good.weightCode}</MediumText>
              ) : null}
              {isAdded && (
                <View style={localStyles.lineView}>
                  {lines.map((line) => (
                    <Chip
                      key={line.id}
                      style={[localStyles.lineChip, { borderColor: colors.primary }]}
                      onPress={() => setSelectedLine(line)}
                    >
                      {line.quantity} {item.good.valueName}
                    </Chip>
                  ))}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [colors.primary, docId, handleAddLine],
  );

  const renderItem = ({ item }: { item: IRemGood }) => <GoodRemains item={item} />;

  const RC = useMemo(() => <RefreshControl refreshing={!goodRemains} title="загрузка данных..." />, [goodRemains]);

  return (
    <AppScreen>
      <Divider />
      {filterVisible && (
        <>
          <View style={styles.flexDirectionRow}>
            <Searchbar
              placeholder="Поиск (штрихкод, наименование, артикул)"
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
      <FlatList
        ref={refList}
        data={filteredList.goodRemains}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={RC}
        ListEmptyComponent={EmptyList}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        keyboardShouldPersistTaps="handled"
        maxToRenderPerBatch={50}
        windowSize={60}
        updateCellsBatchingPeriod={50}
        initialNumToRender={50}
      />
      {(selectedLine || selectedGood) && (
        <DocLineDialog
          selectedLine={selectedLine}
          goodName={selectedLine?.good.name || selectedGood?.good.name || ''}
          onEditLine={handleEditLine}
          onAddLine={handleAddLine}
          onDeleteLine={handleDeleteLine}
          onDismissDialog={hadndleDismissDialog}
          goodValueName={
            selectedGood?.good.valueName || goods.find((i) => i.id === selectedLine?.good.id)?.valueName || ''
          }
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
