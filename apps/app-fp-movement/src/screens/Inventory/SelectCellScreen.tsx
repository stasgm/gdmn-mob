import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import {
  globalStyles as styles,
  LargeText,
  navBackButton,
  AppScreen,
  AppActivityIndicator,
  InfoButton,
} from '@lib/mobile-ui';

import { useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { ICell, ICellRef, IInventoryLine, IMoveDocument, IMoveLine } from '../../store/types';
import { InventoryStackParamList } from '../../navigation/Root/types';

import { alertWithSound, getCellItem, getCellList, getCellListRef } from '../../utils/helpers';
import { ICellRefList, ICellData } from '../../store/app/types';
import { Group } from '../../components/Group';
import { cellColors } from '../../utils/constants';
import { InfoDialog } from '../../components/InfoDialog';

export interface ICellList extends ICell, ICellRef {
  department?: string;
}

const NamedRow = ({ item }: { item: string }) => (
  <View key={item} style={[localStyles.flexColumn, localStyles.height]}>
    <TouchableOpacity style={localStyles.row}>
      <Text style={localStyles.buttonLabel}>{item}</Text>
    </TouchableOpacity>
  </View>
);

export const SelectCellScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<InventoryStackParamList, 'InventorySelectCell'>>();
  const { colors } = useTheme();

  const [visibleDialog, setVisibleDialog] = useState(false);
  const { docId, item, mode } = useRoute<RouteProp<InventoryStackParamList, 'InventorySelectCell'>>().params;

  const doc = docSelectors.selectByDocId<IMoveDocument>(docId);

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const [toCell, setToCell] = useState<IMoveLine | IInventoryLine | undefined>(undefined);
  const [selectedChamber, setSelectedChamber] = useState<string | undefined>('');
  const [selectedRow, setSelectedRow] = useState<string | undefined>('');

  const handleSelectChamber = (chamber: string) => {
    setSelectedRow('');
    setSelectedChamber(chamber);
  };
  const departId = doc?.head.toDepart?.id;

  const docList = useSelector((state) => state.documents.list);

  const docs = useMemo(
    () =>
      docList
        ?.filter(
          (i) =>
            i.documentType?.name === 'movement' &&
            i.status !== 'PROCESSED' &&
            (i?.head?.fromDepart?.id === departId || i?.head?.toDepart?.id === departId),
        )
        .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()) as IMoveDocument[],
    [departId, docList],
  );

  const lines = docs.reduce((prev: IMoveLine[], cur) => {
    prev = [...prev, ...cur.lines];
    return prev;
  }, []);

  const cellList = useMemo(() => getCellList(cells[departId || ''] || [], lines || []), [cells, departId, lines]);

  const cellListRef = getCellListRef(cellList);

  const cell = cellListRef.find((i) => i.barcode === item.barcode);

  useEffect(() => {
    if (item && cell) {
      setSelectedChamber(getCellItem(cell.name).chamber);
      setSelectedRow(getCellItem(cell.name).row);
      setToCell(item);
    } else {
      alertWithSound('Ошибка!', 'Данный товар не находится в ячейке.');
    }
  }, [cell, item, mode]);

  const cellsByRow = useMemo(
    () => (selectedChamber && selectedRow ? Object.entries(cellList?.[selectedChamber][selectedRow]).reverse() : []),
    [cellList, selectedChamber, selectedRow],
  );

  const handleSaveLine = useCallback(
    (cellData: ICellData) => {
      const newCell = `${selectedChamber}-${selectedRow}-${cellData.cell}`;

      const newLine: IInventoryLine = { ...item, toCell: newCell };
      dispatch(documentActions.addDocumentLine({ docId, line: newLine }));
      navigation.goBack();
    },
    [dispatch, docId, item, navigation, selectedChamber, selectedRow],
  );

  const renderRight = useCallback(() => <InfoButton onPress={() => setVisibleDialog(true)} />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const Cell = useCallback(
    ({ i }: { i: ICellData }) => {
      const colorStyle = {
        color: i.disabled || !i.barcode ? colors.backdrop : cellColors.textWhite,
      };
      const backColorStyle = {
        backgroundColor:
          toCell && toCell.barcode === i.barcode ? cellColors.barcode : i.disabled ? colors.backdrop : cellColors.free,
      };

      return (
        <Pressable
          key={i.name}
          style={({ pressed }) => [localStyles.buttons, backColorStyle, pressed && { backgroundColor: colors.accent }]}
          onPress={() => handleSaveLine(i)}
          disabled={i.barcode !== item.barcode || Boolean(i.disabled)}
        >
          <Text style={[localStyles.buttonLabel, colorStyle]}>{i.cell}</Text>
        </Pressable>
      );
    },
    [colors.accent, colors.backdrop, handleSaveLine, item.barcode, toCell],
  );

  const CellsColumn = useCallback(
    ({ cellData }: { cellData: ICellData[] }) => (
      <View style={styles.flexDirectionRow}>
        {cellData?.map((i) => (
          <Cell key={i.name} i={i} />
        ))}
      </View>
    ),
    [Cell],
  );

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <AppActivityIndicator />;
  }

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <AppScreen>
      <View style={localStyles.groupItem}>
        <ScrollView>
          <Group
            values={Object.keys(cellList)}
            onPress={(i) => handleSelectChamber(i)}
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
              onPress={(i) => setSelectedRow(i)}
              selected={selectedRow}
              colorBack="#dbd5da"
              colorSelected="#854875"
              title="Ряд"
            />
          ) : null}
          {selectedRow && selectedChamber && (
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
                      <CellsColumn key={key} cellData={data} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <InfoDialog onOk={() => setVisibleDialog(false)} title="Ячейки" visible={visibleDialog} />
    </AppScreen>
  );
};

const localStyles = StyleSheet.create({
  groupItem: {
    marginTop: 2,
    flex: 1,
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
  height: { height: 50 },
  cellItem: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
