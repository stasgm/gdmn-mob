import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionListData,
  SectionList,
  ListRenderItem,
  Alert,
} from 'react-native';
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
import { ICellRefList, ICellData, ICodeEntity, IGood } from '../../store/app/types';

import { Group } from '../../components/Group';
import { InfoDialog } from '../../components/InfoDialog';
import { cellColors } from '../../utils/constants';

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
    //Точно надо сортировка?
    [docList],
  );

  const lines = useMemo(
    () =>
      docs
        .filter((i) => i.head.fromDepart?.id === id || i.head.toDepart?.id === id)
        .reduce((prev: IMoveLine[], cur) => [...prev, ...cur.lines], []),
    [docs, id],
  );

  const goods = refSelectors.selectByName<IGood>('good').data;

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const cellList = useMemo(() => getCellList(cells[id], lines || []), [cells, id, lines]);

  const cellListRef = getCellListRef(cellList);

  const cellListByGroup = useMemo(
    () =>
      cells[id]
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
    [cells, id],
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

  const cellsByRow =
    selectedChamber && selectedRow ? Object.entries(cellList?.[selectedChamber][selectedRow])?.reverse() : [];

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

  const handleAlert = (label: string, text: string) => {
    Alert.alert(label, `Рекомендуется: ${text}`, [{ text: 'OK' }]);
  };

  const Cell = useCallback(
    ({ item }: { item: ICellData }) => {
      const colorStyle = {
        color:
          item.disabled || (!item.barcode && !(item.defaultGroup && item.defaultGroup.id))
            ? colors.backdrop
            : cellColors.textWhite,
      };
      const backColorStyle = {
        backgroundColor: item.barcode
          ? cellColors.barcode
          : item.disabled
          ? colors.backdrop
          : item.defaultGroup && item.defaultGroup.id
          ? cellColors.default
          : cellColors.free,
      };
      const newItem = lines.find((e) => e.barcode === item.barcode) || getScannedObject(item.barcode || '', item.name);

      return (
        <TouchableOpacity
          key={item.name}
          style={[localStyles.buttons, backColorStyle]}
          onPress={() =>
            item.defaultGroup?.id && !item.barcode
              ? handleAlert(item.name, item.defaultGroup.name)
              : navigation.navigate('GoodLine', {
                  item: newItem,
                })
          }
          disabled={(!item.barcode && !item.defaultGroup?.id) || item.disabled}
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

  const searchTypes: IListItem[] = [
    { id: 'good', value: 'товар' },
    { id: 'group', value: 'группа' },
  ];

  const [searchType, setSearchType] = useState<IListItem>(searchTypes[0]);

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
          <View style={[localStyles.status]}>
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
      <InfoDialog onOk={() => setVisibleInfo(false)} title="Ячейки" visible={visibleInfo} />
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
  status: {
    marginHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
