import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, SectionListData, SectionList, ListRenderItem } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { refSelectors, useSelector } from '@lib/store';
import {
  EmptyList,
  globalStyles as styles,
  ItemSeparator,
  LargeText,
  MediumText,
  navBackButton,
  SearchButton,
  SubTitle,
  AppScreen,
  AppActivityIndicator,
  InfoButton,
  Checkbox,
} from '@lib/mobile-ui';

import { Searchbar, useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { generateId, getDateString, keyExtractor } from '@lib/mobile-hooks';

import { IListItem } from '@lib/mobile-types';

import { INamedEntity } from '@lib/types';

import { FlashList } from '@shopify/flash-list';

import { barcodeSettings, ICell, ICellRef, IMoveDocument, IMoveLine } from '../../store/types';
import { CellsStackParamList } from '../../navigation/Root/types';

import { getBarcode, getCellList, getCellListRef } from '../../utils/helpers';
import { ICellRefList, ICodeEntity, IGood } from '../../store/app/types';

import { Group } from '../../components/Group';
import { InfoDialog } from '../../components/InfoDialog';

import Cells from './components/Cells';

export interface ICellList extends ICell, ICellRef {
  department?: string;
}

export interface OrderListSectionProps {
  title: string;
}

export interface IListItemProps {
  id: string;
  barcode?: string;
  name: string;
  good?: ICodeEntity;
  workDate?: string;
  weight?: number;
  numReceived?: string;
  group?: INamedEntity;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

export const CellsViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CellsStackParamList, 'CellsView'>>();
  const { colors } = useTheme();

  const contactId = useRoute<RouteProp<CellsStackParamList, 'CellsView'>>().params.contactId;

  const [visibleInfo, setVisibleInfo] = useState(false);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const settings = useSelector((state) => state.settings?.data);

  const goodBarcodeSettings = useMemo(
    () =>
      Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
        if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
          prev[idx] = item.data;
        }
        return prev;
      }, {}),
    [settings],
  );

  const docList = useSelector((state) => state.documents.list);
  const docs = useMemo(
    () =>
      docList
        ?.filter(
          (i) =>
            i.documentType?.name === 'movement' &&
            i.status !== 'PROCESSED' &&
            i.lines?.find((e: any) => e.fromCell || e.toCell),
        )
        .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()) as IMoveDocument[],
    [docList],
  );

  const lines = useMemo(
    () =>
      docs
        .filter((i) => i.head.fromDepart?.id === contactId || i.head.toDepart?.id === contactId)
        .reduce((prev: IMoveLine[], cur) => [...prev, ...cur.lines], []),
    [docs, contactId],
  );

  const goods = refSelectors.selectByName<IGood>('good').data;

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const cellList = useMemo(() => getCellList(cells[contactId], lines || []), [cells, contactId, lines]);

  const cellListRef = getCellListRef(cellList);

  const cellListByGroup = useMemo(
    () =>
      cells[contactId]
        .filter((i) => i.defaultGroup?.id)
        .reduce((prev: IListItemProps[], cur) => {
          const gr = prev.find((i) => i.group?.id === cur.defaultGroup?.id);

          if (!gr) {
            prev = [
              ...prev,
              {
                id: cur.name,
                name: cur.name,
                group: cur.defaultGroup,
              } as IListItemProps,
            ];
          }

          return prev;
        }, []),
    [cells, contactId],
  );

  const cellListByGood = useMemo(
    () =>
      cellListRef
        .filter((i) => i.barcode)
        .map((i) => {
          const { shcode, workDate, weight, numReceived } = getBarcode(i.barcode || '', goodBarcodeSettings);

          return {
            id: i.name,
            barcode: i.barcode,
            name: i.name,
            good: goods.find((g) => `0000${g.shcode}`.slice(-4) === shcode),
            workDate,
            weight,
            numReceived,
          } as IListItemProps;
        }),
    [cellListRef, goodBarcodeSettings, goods],
  );

  const filteredListByGroup = useMemo(() => {
    const upper = searchQuery.toUpperCase();
    return (
      cellListByGroup?.filter(
        (i) => i?.group?.name?.toUpperCase().includes(upper) || i?.name.toUpperCase().includes(upper),
      ) || []
    );
  }, [cellListByGroup, searchQuery]);

  const filteredList = useMemo(() => {
    const upper = searchQuery.toUpperCase();
    return (
      cellListByGood
        ?.filter(
          (i) =>
            i.barcode?.toUpperCase().includes(upper) ||
            i.good?.shcode.toUpperCase().includes(upper) ||
            i.good?.name.toUpperCase().includes(upper) ||
            i.name.toUpperCase().includes(upper) ||
            (i.workDate && getDateString(i.workDate).includes(upper)),
        )
        ?.sort((a, b) => new Date(b.workDate || 0).getTime() - new Date(a.workDate || 0).getTime()) || []
    );
  }, [cellListByGood, searchQuery]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = getDateString(item.workDate || '');
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
    [filteredList],
  );

  const [selectedChamber, setSelectedChamber] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<string>('');

  const renderRight = useCallback(
    () => (
      <View style={styles.buttons}>
        <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />
        <InfoButton onPress={() => setVisibleInfo(true)} />
      </View>
    ),
    [filterVisible],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const getScannedObject = useCallback(
    (brc: string, cell: string) => {
      const barc = getBarcode(brc, goodBarcodeSettings);

      const good = goods.find((item) => `0000${item.shcode}`.slice(-4) === barc.shcode);

      const newLine: IMoveLine = {
        good: { id: good?.id || '', name: good?.name || '', shcode: good?.shcode || '' },
        id: generateId(),
        weight: barc.weight,
        barcode: barc.barcode,
        workDate: barc.workDate,
        numReceived: barc.numReceived,
        quantPack: barc.quantPack,
        toCell: cell,
      };
      return newLine;
    },

    [goodBarcodeSettings, goods],
  );

  const renderItemSection: ListRenderItem<IListItemProps> = ({ item }) => {
    return (
      <View style={styles.item} key={item.name}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.name} </LargeText>

          <MediumText>{item.good?.name}</MediumText>
          <View style={styles.directionRow}>
            <MediumText style={styles.number}>Партия: {item.numReceived || ''}</MediumText>
            <MediumText style={styles.number}>{(item.weight || 0).toString()} кг</MediumText>
          </View>
        </View>
      </View>
    );
  };

  const renderItemList = useCallback(({ item }: { item: IListItemProps }) => {
    return (
      <View style={styles.item} key={item.name}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.name} </LargeText>

          <MediumText>{item.group?.name}</MediumText>
        </View>
      </View>
    );
  }, []);

  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const searchTypes: IListItem[] = [
    { id: 'good', value: 'товар' },
    { id: 'group', value: 'группа' },
  ];

  const [searchType, setSearchType] = useState<IListItem>(searchTypes[0]);

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!contactId) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Ячейки по данному подразделению не найдены</LargeText>
      </View>
    );
  }

  return (
    <AppScreen>
      {filterVisible ? (
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
          <View style={localStyles.status}>
            {searchTypes.map((elem) => (
              <View key={elem.id}>
                <Checkbox
                  key={elem.id}
                  title={elem.value}
                  selected={searchType.id === elem.id}
                  onSelect={() => setSearchType(elem)}
                />
              </View>
            ))}
          </View>
          <ItemSeparator />
          {searchType.id === 'good' ? (
            <SectionList
              sections={sections}
              renderItem={renderItemSection}
              ItemSeparatorComponent={ItemSeparator}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={EmptyList}
              keyboardShouldPersistTaps={'handled'}
            />
          ) : (
            <FlashList
              data={filteredListByGroup}
              renderItem={renderItemList}
              estimatedItemSize={60}
              ItemSeparatorComponent={ItemSeparator}
              keyExtractor={keyExtractor}
              extraData={[filteredListByGroup]}
              keyboardShouldPersistTaps={'handled'}
            />
          )}
        </>
      ) : (
        <View style={localStyles.groupItem}>
          <ScrollView>
            <Group
              values={Object.keys(cellList)}
              onPress={(item) => setSelectedChamber(item)}
              selected={selectedChamber}
              colorBack="#d5dce3"
              colorSelected={colors.placeholder}
              title="Камера"
              heightBtn={54}
              widthBtn={106}
            />
            {selectedChamber ? (
              <Group
                values={Object.keys(cellList[selectedChamber])}
                onPress={(item) => setSelectedRow(item)}
                selected={selectedRow}
                colorBack="#dbd5da"
                colorSelected="#854875"
                title="Ряд"
              />
            ) : null}
            {selectedRow && selectedChamber && (
              <Cells
                lines={lines}
                cellList={cellList}
                getScannedObject={getScannedObject}
                selectedChamber={selectedChamber}
                selectedRow={selectedRow}
              />
            )}
          </ScrollView>
        </View>
      )}
      <InfoDialog onOk={() => setVisibleInfo(false)} title="Ячейки" visible={visibleInfo} />
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  groupItem: {
    flex: 1,
    marginTop: 2,
  },
  status: {
    marginHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
