import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SectionListData, SectionList, ListRenderItem } from 'react-native';
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
} from '@lib/mobile-ui';

import { Searchbar, useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { generateId, getDateString } from '@lib/mobile-hooks';

import { barcodeSettings, ICell, ICellRef, IMoveDocument, IMoveLine } from '../../store/types';
import { CellsStackParamList } from '../../navigation/Root/types';

import { getBarcode, getCellList } from '../../utils/helpers';
import { ICellRefList, ICellData, ICodeEntity, IGood } from '../../store/app/types';

import { Group } from '../../components/Group';

export interface ICellList extends ICell, ICellRef {
  department?: string;
}

export interface OrderListSectionProps {
  title: string;
}

export interface IListItemProps {
  barcode: string;
  name: string;
  good: ICodeEntity;
  workDate: string;
  weight: number;
  numReceived: string;
}

export type SectionDataProps = SectionListData<IListItemProps, OrderListSectionProps>[];

const NamedRow = ({ item }: { item: string }) => (
  <View key={item} style={[localStyles.flexColumn, localStyles.height]}>
    <TouchableOpacity style={localStyles.row}>
      <Text style={localStyles.buttonLabel}>{item}</Text>
    </TouchableOpacity>
  </View>
);

export const CellsViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CellsStackParamList, 'CellsView'>>();
  const { colors } = useTheme();

  const id = useRoute<RouteProp<CellsStackParamList, 'CellsView'>>().params.id;

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
    //Точно надо сортировка?
    [docList],
  );

  const lines = useMemo(
    () =>
      docs
        .filter((i) => i.head.fromDepart.id === id || i.head.toDepart.id === id)
        .reduce((prev: IMoveLine[], cur) => [...prev, ...cur.lines], []),
    [docs, id],
  );

  // console.log('lines', jsonFormat(lines));

  const goods = refSelectors.selectByName<IGood>('good').data;

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];
  const cellListByGood = useMemo(
    () =>
      cells[id]
        .filter((i) => i.barcode)
        .map((i) => {
          const { shcode, workDate, weight, numReceived } = getBarcode(i.barcode || '', goodBarcodeSettings);
          return {
            barcode: i.barcode,
            name: i.name,
            good: goods.find((g) => g.shcode === shcode),
            workDate,
            weight,
            numReceived,
          } as IListItemProps;
        }),
    [cells, goodBarcodeSettings, goods, id],
  );

  const filteredList = useMemo(() => {
    const upper = searchQuery.toUpperCase();
    return (
      cellListByGood
        ?.filter((i) =>
          // i.barcode?.toUpperCase().includes(upper) ||
          // i.good?.shcode.toUpperCase().includes(upper) ||
          // i.good?.name.toUpperCase().includes(upper) ||
          // i.name.toUpperCase().includes(upper) ||
          // getDateString(i.workDate).includes(upper),
          i.barcode || i?.good?.name || i?.good?.shcode || i.name || i.workDate
            ? i?.good?.shcode.toUpperCase().includes(searchQuery.toUpperCase()) ||
              i?.good?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
              i?.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
              getDateString(i?.workDate).includes(getDateString(searchQuery))
            : false,
        )
        ?.sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime()) || []
    );
  }, [cellListByGood, searchQuery]);

  const sections = useMemo(
    () =>
      filteredList.reduce<SectionDataProps>((prev, item) => {
        const sectionTitle = getDateString(item.workDate);
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

  const cellList = useMemo(() => getCellList(cells[id], lines || []), [cells, id, lines]);

  const [selectedChamber, setSelectedChamber] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<string>('');

  const renderRight = useCallback(
    () => <SearchButton onPress={() => setFilterVisible((prev) => !prev)} visible={filterVisible} />,
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

  const cellsByRow =
    selectedChamber && selectedRow ? Object.entries(cellList[selectedChamber][selectedRow]).reverse() : [];

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    return (
      <View style={styles.item} key={item.name}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.name} </LargeText>
          <MediumText>{item.good.name}</MediumText>
          <View style={styles.directionRow}>
            <MediumText style={styles.number}>Партия: {item.numReceived || ''}</MediumText>
            <MediumText style={styles.number}>{(item.weight || 0).toString()} кг</MediumText>
          </View>
        </View>
      </View>
    );
  };
  const renderSectionHeader = ({ section }: any) => (
    <SubTitle style={[styles.header, styles.sectionTitle]}>{section.title}</SubTitle>
  );

  const Cell = useCallback(
    ({ item }: { item: ICellData }) => {
      const colorStyle = {
        color:
          item.disabled || (!item.barcode && !(item.defaultGroup && item.defaultGroup.id)) ? colors.backdrop : 'white',
      };
      const backColorStyle = {
        backgroundColor: item.barcode
          ? '#226182'
          : item.disabled
          ? colors.backdrop
          : item.defaultGroup && item.defaultGroup.id
          ? '#2b7849'
          : '#d5dce3',
      };
      const newItem = lines.find((e) => e.barcode === item.barcode) || getScannedObject(item.barcode || '', item.name);
      // const defaultCell = cells[id || ''].find((i) => i.defaultGroup === newItem.good.shcode && !i.barcode);

      // const good = goods.find((i) => `0000${i.shcode}`.slice(-4) === defaultCell?.defaultGoodShcode);

      return (
        <TouchableOpacity
          key={item.name}
          style={[localStyles.buttons, backColorStyle]}
          onPress={() =>
            navigation.navigate('GoodLine', {
              item: newItem,
            })
          }
          disabled={!item.barcode || item.disabled}
        >
          <Text style={[localStyles.buttonLabel, colorStyle]}>{item.cell}</Text>
        </TouchableOpacity>
      );
    },
    [colors.backdrop, getScannedObject, lines, navigation],
  );

  const CellsColumn = useCallback(
    ({ data }: { data: ICellData[] }) => (
      <View style={styles.flexDirectionRow}>
        {data?.map((item) => (
          <Cell key={item.name} item={item} />
        ))}
      </View>
    ),
    [Cell],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!id) {
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
          <ItemSeparator />
          <SectionList
            sections={sections}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={EmptyList}
            keyboardShouldPersistTaps={'handled'}
          />
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
            {selectedRow && selectedChamber ? (
              <View>
                <Text style={localStyles.cellItem}>Ячейки</Text>
                <View style={styles.flexDirectionRow}>
                  <View style={styles.directionColumn}>
                    {cellsByRow.map(([key, _]) => (
                      <NamedRow key={key} item={key} />
                    ))}
                  </View>
                  <ScrollView horizontal>
                    <View style={styles.directionColumn}>
                      {cellsByRow.map(([key, data]) => (
                        <CellsColumn key={key} data={data} />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  groupItem: {
    flex: 1,
    marginTop: 2,
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 3,
  },
  buttons: {
    padding: 4,
    borderRadius: 4,
    margin: 3,
    textAlign: 'center',
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.9,
    lineHeight: 14,
    textAlignVertical: 'center',
  },
  row: {
    alignItems: 'center',
    width: 20,
  },
  height: {
    height: 50,
  },
  cellItem: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
