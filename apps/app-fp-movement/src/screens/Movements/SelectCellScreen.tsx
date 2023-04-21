import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles, LargeText, navBackButton, AppScreen, AppActivityIndicator } from '@lib/mobile-ui';

import { Checkbox, useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { ICell, ICellRef, IMoveDocument, IMoveLine } from '../../store/types';
import { MoveStackParamList } from '../../navigation/Root/types';

import { getCellItem, getCellList, jsonFormat } from '../../utils/helpers';
import { ICellRefList, ICellData } from '../../store/app/types';
import { Group } from '../../components/Group';

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
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'SelectCell'>>();
  const { colors } = useTheme();

  const { docId, item, mode } = useRoute<RouteProp<MoveStackParamList, 'SelectCell'>>().params;

  const doc = docSelectors.selectByDocId<IMoveDocument>(docId);

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const [fromCell, setFromCell] = useState<IMoveLine | undefined>(undefined);
  const [toCell, setToCell] = useState<IMoveLine | undefined>(undefined);
  const [selectedChamber, setSelectedChamber] = useState<string | undefined>('');
  const [selectedRow, setSelectedRow] = useState<string | undefined>('');

  const [defaultCell, setDefaultCell] = useState<string | undefined>(undefined);

  const [isDoublePallet, setIsDoublePallet] = useState(false);
  const [neighbourSells, setNeighbourCells] = useState<ICellData[]>([]);

  const departId = useMemo(
    () => (doc?.head.fromDepart.isAddressStore && !fromCell ? doc?.head.fromDepart.id : doc?.head.toDepart.id),
    [doc?.head, fromCell],
  );

  const docList = useSelector((state) => state.documents.list);

  const docs = useMemo(
    () =>
      docList
        ?.filter(
          (i) =>
            i.documentType?.name === 'movement' &&
            i.status !== 'PROCESSED' &&
            (i?.head?.fromDepart.id === departId || i?.head?.toDepart.id === departId),
        )
        .sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()) as IMoveDocument[],
    [departId, docList],
  );

  const lines = docs.reduce((prev: IMoveLine[], cur) => {
    prev = [...prev, ...cur.lines];
    return prev;
  }, []);

  const cellList = useMemo(() => getCellList(cells[departId || ''] || [], lines || []), [cells, departId, lines]);

  const handleAddLine = useCallback(
    (line: IMoveLine) => {
      dispatch(documentActions.addDocumentLine({ docId, line }));
      navigation.goBack();
    },
    [dispatch, docId, navigation],
  );

  useEffect(() => {
    if (item && item.toCell && mode === 1) {
      setSelectedChamber(getCellItem(item.toCell).chamber);
      setSelectedRow(getCellItem(item.toCell).row);
      setToCell(item);
    }
  }, [item, mode]);

  const defaultGoodCell = cells[departId || ''].find((i) => i.defaultGoodShcode === item.good.shcode);

  useEffect(() => {
    if (defaultGoodCell && mode === 0) {
      const dividedCell = getCellItem(defaultGoodCell.name);

      const currentCell = cellList[dividedCell.chamber][dividedCell.row][dividedCell.tier].find(
        (i) => i.cell === dividedCell.cell,
      );

      if (!currentCell?.barcode) {
        setSelectedChamber(dividedCell.chamber);
        setSelectedRow(dividedCell.row);
        setDefaultCell(defaultGoodCell.name);
      }
    }
  }, [cellList, defaultGoodCell, item, mode]);

  const cellsByRow = useMemo(
    () => (selectedChamber && selectedRow ? Object.entries(cellList[selectedChamber][selectedRow]).reverse() : []),
    [cellList, selectedChamber, selectedRow],
  );

  const handleSaveLine = useCallback(
    (cellData: ICellData, tier: string) => {
      const newCell = `${selectedChamber}-${selectedRow}-${tier}-${cellData.cell}`;

      if (mode === 0) {
        if (doc?.head.fromDepart.isAddressStore) {
          if (!fromCell) {
            if (cellData.barcode === item?.barcode) {
              if (!doc?.head.toDepart.isAddressStore) {
                const newLine: IMoveLine = { ...item, fromCell: newCell };
                handleAddLine(newLine);
              } else {
                setFromCell({ ...item, fromCell: newCell });
              }
            } else {
              Alert.alert('Ошибка выбора ячейки!', 'Данная ячейка занята другим товаром, выберите другую ячейку.', [
                {
                  text: 'ОК',
                },
              ]);
            }
          } else {
            const newLine: IMoveLine = { ...fromCell, toCell: newCell };
            handleAddLine(newLine);
          }
        } else {
          const newLine: IMoveLine = { ...item, toCell: newCell };
          handleAddLine(newLine);
        }
      } else {
        const newLine: IMoveLine = { ...item, toCell: newCell };
        dispatch(
          documentActions.updateDocumentLine({
            docId,
            line: newLine,
          }),
        );
        navigation.goBack();
      }
    },
    [
      dispatch,
      doc?.head.fromDepart.isAddressStore,
      doc?.head.toDepart.isAddressStore,
      docId,
      fromCell,
      handleAddLine,
      item,
      mode,
      navigation,
      selectedChamber,
      selectedRow,
    ],
  );

  const handleAddDouble = useCallback(
    (cellData: ICellData, tier: string) => {
      const newCell = `${selectedChamber}-${selectedRow}-${tier}-${cellData.cell}`;
      const newLine: IMoveLine = { ...item, toCell: newCell };

      if (isDoublePallet) {
        const cellsInRow = cellsByRow.find((i) => i[0] === tier)?.[1];
        const firstPart = cellsInRow?.find((i) => i.name === newCell);
        const index = cellsInRow?.indexOf(firstPart);

        const isLeftFree =
          cellsInRow &&
          index &&
          cellsInRow[index - 1] &&
          !cellsInRow[index - 1].barcode &&
          !cellsInRow[index - 1].disabled;
        const isRightFree =
          cellsInRow &&
          index &&
          cellsInRow[index + 1] &&
          !cellsInRow[index + 1].barcode &&
          !cellsInRow[index + 1].disabled;
        if (isLeftFree || isRightFree) {
          setNeighbourCells(
            isLeftFree && isRightFree
              ? [cellsInRow[index - 1], cellsInRow[index + 1]]
              : isLeftFree
              ? [cellsInRow[index - 1]]
              : [cellsInRow[index + 1]],
          );
          setToCell(newLine);
          return;
        } else {
          Alert.alert('Ошибка выбора ячейки!', 'Выберите другую ячейку.', [
            {
              text: 'ОК',
            },
          ]);
          return;
        }
      }
    },
    [cellsByRow, isDoublePallet, item, selectedChamber, selectedRow],
  );

  console.log('ssss', neighbourSells);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

  const Cell = useCallback(
    ({ i, row }: { row: string; i: ICellData }) => {
      const iss =
        isDoublePallet && Boolean(neighbourSells.length) && Boolean(!neighbourSells.find((e) => e.name === i.name));
      const colorStyle = {
        color:
          defaultCell && defaultCell === i.name
            ? 'white'
            : (iss && i.barcode) || i.disabled || !i.barcode
            ? colors.backdrop
            : 'white',
      };
      const colorBack = '#d5dce3';
      const backColorStyle = {
        backgroundColor:
          (fromCell && fromCell.barcode === i.barcode) ||
          (toCell && toCell.barcode === i.barcode) ||
          (toCell && toCell.toCell === i.name) ||
          (defaultCell && defaultCell === i.name)
            ? '#b557a2'
            : i.barcode
            ? '#226182'
            : i.disabled || iss
            ? colors.disabled
            : colorBack,
      };

      return (
        <TouchableOpacity
          key={i.name}
          style={[localStyles.buttons, backColorStyle]}
          onPress={() => (isDoublePallet && !neighbourSells.length ? handleAddDouble(i, row) : handleSaveLine(i, row))}
          disabled={
            (doc?.head.fromDepart.isAddressStore && !fromCell ? !i.barcode : Boolean(i.barcode)) || i.disabled || iss
          }
        >
          <Text style={[localStyles.buttonLabel, colorStyle]}>{i.cell}</Text>
        </TouchableOpacity>
      );
    },
    [
      colors.backdrop,
      colors.disabled,
      defaultCell,
      doc?.head.fromDepart.isAddressStore,
      fromCell,
      handleAddDouble,
      handleSaveLine,
      isDoublePallet,
      neighbourSells,
      toCell,
    ],
  );

  const CellsColumn = useCallback(
    ({ row, cellData }: { row: string; cellData: ICellData[] }) => (
      <View style={styles.flexDirectionRow}>
        {cellData?.map((i) => (
          <Cell key={i.name} row={row} i={i} />
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
        {fromCell ? (
          <View style={styles.alignItemsCenter}>
            <Text style={localStyles.buttonLabel}>Из {fromCell?.fromCell}</Text>
          </View>
        ) : null}
        <ScrollView>
          {departId && cells[departId] ? (
            <Checkbox.Item
              color={colors.primary}
              uncheckedColor={colors.primary}
              status={isDoublePallet ? 'checked' : 'unchecked'}
              onPress={() => setIsDoublePallet(!isDoublePallet)}
              label="Двойной поддон"
              position="leading"
              style={[localStyles.checkBox]}
              labelStyle={localStyles.buttonLabel}
            />
          ) : null}
          <Group
            values={Object.keys(cellList)}
            onPress={(i) => setSelectedChamber(i)}
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
                      <CellsColumn key={key} row={key} cellData={data} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
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
  checkBox: { marginLeft: -20, width: 180, marginVertical: -5 },
});
