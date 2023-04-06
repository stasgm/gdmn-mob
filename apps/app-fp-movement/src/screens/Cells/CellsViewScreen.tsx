import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ColorValue,
  SectionListData,
  SectionList,
  ListRenderItem,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
} from '@lib/mobile-ui';

import { Searchbar, useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { generateId, getDateString } from '@lib/mobile-hooks';

import { barcodeSettings, ICell, ICellRef, IMoveDocument, IMoveLine } from '../../store/types';
import { CellsStackParamList } from '../../navigation/Root/types';

import { getBarcode, getCellList, jsonFormat } from '../../utils/helpers';
import { ICellRefList, ICodeEntity, IGood } from '../../store/app/types';

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

export const CellsViewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CellsStackParamList, 'CellsView'>>();

  const { id } = useRoute<RouteProp<CellsStackParamList, 'CellsView'>>().params;

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const settings = useSelector((state) => state.settings?.data);

  const goodBarcodeSettings = Object.entries(settings).reduce((prev: barcodeSettings, [idx, item]) => {
    if (item && item.group?.id !== 'base' && typeof item.data === 'number') {
      prev[idx] = item.data;
    }
    return prev;
  }, {});

  const goods = refSelectors.selectByName<IGood>('good').data;

  const cells = refSelectors.selectByName<ICellRefList>('cell').data[0];
  const cellListByGood = cells[id]
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
      };
    });

  console.log('1234', jsonFormat(cellListByGood));
  const docsLines = (
    useSelector((state) => state.documents.list)?.filter(
      (i) =>
        i.documentType?.name === 'movement' &&
        i.status !== 'PROCESSED' &&
        i.lines?.find((e) => (e as IMoveLine).fromCell || (e as IMoveLine).toCell),
    ) as IMoveDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const filteredList = useMemo(() => {
    return (
      cellListByGood
        ?.filter((i) =>
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

  const lines = docsLines
    .filter((i) => i.head.fromDepart.id === id || i.head.toDepart.id === id)
    .reduce((prev: IMoveLine[], cur) => {
      prev = [...prev, ...cur.lines];
      return prev;
    }, []);

  const cellList = getCellList(cells[id], lines || []);

  const { colors } = useTheme();

  const windowWidth = useWindowDimensions().width;
  const groupButtonStyle = useMemo(
    () => ({
      width: windowWidth > 550 ? '21.5%' : '29.5%',
    }),
    [windowWidth],
  );

  const [selectedChamber, setSelectedChamber] = useState<string | undefined>('');
  const [selectedRow, setSelectedRow] = useState<string | undefined>('');

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

  const TEXT_LENGTH = 50;
  const TEXT_HEIGHT = 30;
  const OFFSET = TEXT_LENGTH / 2 - TEXT_HEIGHT / 2;

  const Group = useCallback(
    ({
      values,
      onPress,
      selected,
      colorBack,
      colorSelected,
      title,
    }: {
      title: string;
      values: string[];
      onPress: (item: string) => void;
      selected?: string;
      colorBack: ColorValue;
      colorSelected: ColorValue;
    }) => {
      return (
        <View style={[styles.flexDirectionRow, { width: '100%' }]}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              margin: 3,
              width: TEXT_HEIGHT,
              height: 60,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                transform: [{ rotate: '270deg' }, { translateX: -OFFSET }, { translateY: OFFSET }],
                width: 60,
                height: TEXT_HEIGHT + 5,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
              }}
            >
              {title}
            </Text>
          </View>
          <View style={[localStyles.flexRowWrap, { width: windowWidth - 20 }]}>
            {values.map((item) => {
              const colorStyle = { color: selected === item ? 'white' : colors.text };
              const backColorStyle = { backgroundColor: selected === item ? colorSelected : colorBack };
              return (
                <TouchableOpacity
                  key={item}
                  style={[localStyles.button, backColorStyle, groupButtonStyle]}
                  onPress={() => onPress(item)}
                >
                  <Text style={[localStyles.buttonLabel, colorStyle]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    },
    [OFFSET, colors.text, groupButtonStyle, windowWidth],
  );

  const renderItem: ListRenderItem<IListItemProps> = ({ item }) => {
    return (
      <View style={styles.item} key={item.name}>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.name} </LargeText>
          <MediumText>{item.good.name} 1123456789987654321 вторая строчка вторая</MediumText>

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

  if (!id) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Ячейки по данному подразделению не найдены</LargeText>
      </View>
    );
  }

  return (
    <>
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
            // keyExtractor={keyExtractor}
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
              <View style={styles.flexDirectionRow}>
                <View style={styles.directionColumn}>
                  {Object.keys(cellList[selectedChamber][selectedRow])
                    .reverse()
                    .map((keyy) => {
                      // const colorStyle = { color: 'white' };
                      // const backColorStyle = { backgroundColor: colors.accent };
                      return (
                        <View key={keyy} style={[localStyles.flexColumn, localStyles.height]}>
                          <TouchableOpacity style={[localStyles.row]}>
                            <Text style={[localStyles.buttonLabel /*, colorStyle*/]}>{keyy}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
                <ScrollView horizontal>
                  <View style={styles.directionColumn}>
                    {Object.entries(cellList[selectedChamber][selectedRow])
                      .reverse()
                      .map(([keyy, vall]) => {
                        const colorBack = '#d5dce3';
                        return (
                          <View key={keyy} style={styles.flexDirectionRow}>
                            {vall?.map((i) => {
                              const colorStyle1 = {
                                color: i.disabled || !i.barcode ? colors.backdrop : 'white',
                              };
                              const backColorStyle1 = {
                                backgroundColor: i.barcode ? '#226182' : i.disabled ? colors.disabled : colorBack,
                              };
                              return (
                                <TouchableOpacity
                                  key={i.name}
                                  style={[
                                    localStyles.buttons,
                                    // {
                                    //   width:
                                    //     windowWidth > 550 ? (windowWidth * 0.215 - 9) / 2 : (windowWidth * 0.295 - 14) / 2,
                                    //   height:
                                    //     windowWidth > 550 ? (windowWidth * 0.215 - 9) / 2 : (windowWidth * 0.295 - 14) / 2,
                                    // },
                                    backColorStyle1,
                                  ]}
                                  onPress={() =>
                                    navigation.navigate('GoodLine', {
                                      item:
                                        lines.find((e) => e.barcode === i.barcode) ||
                                        getScannedObject(i.barcode || '', i.name),
                                    })
                                  }
                                  disabled={!i.barcode || i.disabled}
                                >
                                  <Text style={[localStyles.buttonLabel, colorStyle1]}>{i.cell}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        );
                      })}
                  </View>
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const localStyles = StyleSheet.create({
  groupItem: {
    marginBottom: 2,
    flex: 1,
    marginTop: 5,
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 3,
  },
  button: {
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    margin: 3,
    textAlign: 'center',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 70,
  },
  row: {
    alignItems: 'center',
    borderRadius: 18,
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  height: { height: 50 },
});
