// export { SelectCellScreen } from './SelectCellScreenOptimized';

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

import { MD2Theme, useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { DashboardStackParamList } from '@lib/mobile-navigation';

import {
  ICell,
  ICellMovementDocument,
  ICellMovementLine,
  ICellRef,
  IReceiptDocument,
  IReceiptLine,
  // IInventoryLine,
  // IMoveDocument,
  // IMoveLine,
  // IPalletDocument,
} from '../../store/types';
import { CellMovementStackParamList } from '../../navigation/Root/types';

import {
  alertWithSound,
  cellHasBarcode,
  getCellGoodQuantity,
  getCellItem,
  getCellList,
  getCellListRef,
} from '../../utils/cellHelpers';
import { ICellRefList, ICellData } from '../../store/app/types';
import { Group } from '../../components/Group';
import { cellColors } from '../../utils/constants';
import { CellInfoDialog } from '../../components/CellInfoDialog';
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
  const navigation =
    useNavigation<StackNavigationProp<CellMovementStackParamList & DashboardStackParamList, 'SelectCell'>>();
  const { colors } = useTheme<MD2Theme>();

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [cellInfoDialogVisible, setCellInfoDialogVisible] = useState(false);
  const [selectedCellForDialog, setSelectedCellForDialog] = useState<ICellData | null>(null);
  const { docId, item, mode } = useRoute<RouteProp<CellMovementStackParamList, 'SelectCell'>>().params;
  const doc = docSelectors.selectByDocId<ICellMovementDocument>(docId);
  // console.log('doc', doc);

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const [fromCell, setFromCell] = useState<ICellMovementLine | undefined>(undefined);
  const [toCell, _setToCell] = useState<ICellMovementLine | undefined>(undefined);
  const [selectedChamber, setSelectedChamber] = useState<string | undefined>();
  const [selectedRow, setSelectedRow] = useState<string | undefined>();
  // console.log('selectedChamber', selectedChamber);
  // console.log('selectedRow', selectedRow);
  const [defaultCell, _setDefaultCell] = useState<string[]>([]);

  const departId = useMemo(
    () =>
      doc?.head.fromDepartment && doc?.head.fromDepartment?.isAddressStore && !fromCell
        ? doc?.head.fromDepartment?.id
        : doc?.head.toDepartment?.isAddressStore
          ? doc?.head.toDepartment?.id
          : undefined,
    [doc?.head, fromCell],
  );

  // console.log('departId', departId);

  const docs1 = useSelector((state) => state.documents.list) as IReceiptDocument[];

  const list = docs1?.filter((i) => i.documentType.subtype === 'was' && i.documentType.name === 'prihod');
  const prihodLines = list?.reduce((prev: IReceiptLine[], curr: IReceiptDocument) => [...prev, ...curr.lines], []);

  // const departId = useMemo(() => doc?.head.toDepartment?.id, [doc?.head]);
  const docList = useSelector((state) => state.documents.list);

  const docs = useMemo(
    () =>
      docList
        ?.filter(
          (i) =>
            i.documentType?.name === 'movement' &&
            i.documentType.subtype === 'was' &&
            i.status !== 'PROCESSED' &&
            (i?.head?.fromDepartment?.id === departId || i?.head?.toDepartment?.id === departId),
        )
        .sort(
          (a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime(),
        ) as ICellMovementDocument[],
    [departId, docList],
  );

  // const palletList = docList.filter((i) => i.documentType?.name === 'pallet') as ICellMovementDocument[];

  const lines = docs.reduce((prev: ICellMovementLine[], cur) => [...prev, ...cur.lines], []);

  // console.log('lines', lines);

  const cellList = useMemo(() => {
    // Основной вариант — берём ячейки по текущему подразделению.
    const byDepart = departId && Array.isArray(cells?.[departId]) ? (cells?.[departId] as ICellRef[]) : undefined;

    // Если для этого подразделения нет ячеек, но в справочнике они есть,
    // показываем все ячейки как запасной вариант, чтобы пользователь
    // всё равно мог выбрать ячейку.
    const fallbackAll = !byDepart && cells ? (Object.values(cells).flat() as ICellRef[]) : [];

    const src = byDepart || fallbackAll;

    return getCellList(src || [], lines ?? []);
  }, [cells, departId, lines]);

  const handleAddLine = useCallback(
    (line: ICellMovementLine) => {
      dispatch(documentActions.addDocumentLine({ docId, line }));
      navigation.goBack();
    },
    [dispatch, docId, navigation],
  );

  // useEffect(() => {
  //   if (item && item.toCell && mode === 1) {
  //     setSelectedChamber(getCellItem(item.toCell).chamber);
  //     setSelectedRow(getCellItem(item.toCell).row);
  //     setToCell(item);
  //   }
  // }, [item, mode]);

  // const defaultGoodCells = (cells[departId || ''] || []).filter(
  //   (i) => i.defaultGroup?.id && i.defaultGroup?.id === item.good.goodGroupId,
  // );

  // const dividedCells = defaultGoodCells.reduce((prev: ICellName[], cur) => {
  //   const dividedCell = getCellItem(cur.name);

  //   prev = [...prev, dividedCell];
  //   return prev;
  // }, []);

  // const currentCell = dividedCells.length
  //   ? cellList[dividedCells[0].chamber][dividedCells[0].row][defaultGoodCells[0].tier].find(
  //       (i) => i.cell === dividedCells[0].cell,
  //     )
  //   : undefined;

  const cellListRef = getCellListRef(cellList);

  const cell = cellListRef.find((i) => i.barcode === item.barcode)?.name;
  console.log('cell', cell);
  useEffect(() => {
    // Если отгружаем из адресного склада, пытаемся найти ячейку по штрих‑коду
    if (
      cell &&
      doc?.head.fromDepartment?.isAddressStore &&
      (doc.head.documentSubtype?.id === 'movement' || doc.head.documentSubtype?.id === 'cellMovement') &&
      mode === 0
    ) {
      if (doc.head.documentSubtype?.id === 'movement') {
        const newLine: ICellMovementLine = { ...item, fromCell: cell };
        dispatch(documentActions.addDocumentLine({ docId, line: newLine }));
        navigation.goBack();
      } else {
        const cellItem = getCellItem(cell);
        setSelectedChamber(cellItem.chamber);
        setSelectedRow(cellItem.row);
        setFromCell({ ...item, fromCell: cell });
      }
    }
  }, [
    cell,
    doc?.head.documentSubtype?.id,
    doc?.head.fromDepartment?.isAddressStore,
    docId,
    dispatch,
    item,
    mode,
    navigation,
  ]);

  // useEffect(() => {
  //   if (currentCell && !currentCell?.barcode /*&& doc?.head.toDepart?.isAddressStore*/) {
  //     setSelectedChamber(dividedCells[0].chamber);
  //     setSelectedRow(dividedCells[0].row);
  //     setDefaultCell(defaultGoodCells.map((i) => i.name));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentCell?.barcode, mode]);

  const chamberKeys = useMemo(() => Object.keys(cellList ?? {}), [cellList]);
  // console.log('chamberKeys', chamberKeys);
  const hasChamberLevel = useMemo(() => chamberKeys.filter((k) => k).length >= 1, [chamberKeys]);

  const rowKeysForSelected = useMemo(
    () => (selectedChamber !== undefined ? Object.keys(cellList?.[selectedChamber] || {}) : []),
    [cellList, selectedChamber],
  );

  const hasRowLevel = useMemo(() => rowKeysForSelected.filter((k) => k).length >= 1, [rowKeysForSelected]);
  // console.log('hasRowLevel', hasRowLevel);
  useEffect(() => {
    if (selectedChamber === undefined && chamberKeys.length === 1) {
      setSelectedChamber(chamberKeys[0]);
    }
  }, [chamberKeys, selectedChamber]);

  useEffect(() => {
    if (selectedRow === undefined && rowKeysForSelected.length === 1) {
      setSelectedRow(rowKeysForSelected[0]);
    }
  }, [rowKeysForSelected, selectedRow]);

  // When we need to take from a cell (movement / cellMovement) and fromDepartment is address store,
  // ensure grid is visible: if no cell matched by barcode, default to first chamber/row
  // so user can pick a "from" cell.
  const isFromAddressStore = Boolean(
    doc?.head.fromDepartment?.isAddressStore &&
      mode === 0 &&
      (doc?.head.documentSubtype?.id === 'movement' || doc?.head.documentSubtype?.id === 'cellMovement'),
  );
  useEffect(() => {
    if (!isFromAddressStore) {
      return;
    }
    if (selectedChamber === undefined && chamberKeys.length >= 1) {
      setSelectedChamber(chamberKeys[0]);
    }
  }, [isFromAddressStore, chamberKeys, selectedChamber]);

  useEffect(() => {
    if (!isFromAddressStore) {
      return;
    }
    if (selectedRow === undefined && rowKeysForSelected.length >= 1) {
      setSelectedRow(rowKeysForSelected[0]);
    }
  }, [isFromAddressStore, rowKeysForSelected, selectedRow]);

  const cellsByRow = useMemo(() => {
    if (selectedChamber === undefined) {
      return [];
    }

    const rowsObject = cellList?.[selectedChamber] || {};

    // If there is a real row dimension, we rely on selectedRow.
    if (hasRowLevel) {
      if (!selectedRow) {
        return [];
      }
      return Object.entries(rowsObject?.[selectedRow] || {}).reverse();
    }

    // No row level: use the only available row key (often '').
    const firstRowKey = Object.keys(rowsObject)[0];
    if (firstRowKey === undefined) {
      return [];
    }

    return Object.entries(rowsObject?.[firstRowKey] || {}).reverse();
  }, [cellList, hasRowLevel, selectedChamber, selectedRow]);

  const handleSaveLine = useCallback(
    (cellData: ICellData) => {
      let newCell: string;
      if (hasChamberLevel && hasRowLevel) {
        newCell = `${selectedChamber}-${selectedRow}-${cellData.cell}`;
      } else if (hasChamberLevel && !hasRowLevel) {
        newCell = `${selectedChamber}-${cellData.cell}`;
      } else if (!hasChamberLevel && hasRowLevel) {
        newCell = `${selectedRow}-${cellData.cell}`;
      } else {
        newCell = `${cellData.cell}`;
      }

      // const storeDate = new Date().toISOString();
      if (mode === 0) {
        if (
          doc?.head.fromDepartment?.isAddressStore &&
          (doc.head.documentSubtype?.id === 'movement' || doc.head.documentSubtype?.id === 'cellMovement')
        ) {
          if (!fromCell) {
            const barcode = item?.barcode ?? '';
            if (cellHasBarcode(cellData, barcode)) {
              const cellQty = getCellGoodQuantity(cellData, barcode);
              const lineQty = item.quantity ?? 1;
              if (cellQty < lineQty) {
                alertWithSound(
                  'Ошибка выбора ячейки!',
                  `В ячейке недостаточно товара: в ячейке ${cellQty}, требуется ${lineQty}.`,
                );
                return;
              }
              if (doc.head.documentSubtype?.id === 'movement') {
                const newLine: ICellMovementLine = { ...item, fromCell: newCell };
                handleAddLine(newLine);
              } else if (!doc?.head.toDepartment?.isAddressStore) {
                const newLine: ICellMovementLine = { ...item, fromCell: newCell };
                handleAddLine(newLine);
              } else {
                setFromCell({ ...item, fromCell: newCell });
              }
            } else {
              alertWithSound('Ошибка выбора ячейки!', 'Данная ячейка занята другим товаром, выберите другую ячейку.');
            }
          } else if (doc?.head.toDepartment?.isAddressStore) {
            if (doc.head.documentSubtype?.id === 'cellMovement' && fromCell.fromCell === newCell) {
              alertWithSound(
                'Ошибка выбора ячейки!',
                'Нельзя переместить товар в ту же самую ячейку. Выберите другую ячейку.',
              );
              return;
            }
            const newLine: ICellMovementLine = { ...fromCell, toCell: newCell /*, storeDate */ };
            handleAddLine(newLine);
          } else {
            const newLine: ICellMovementLine = { ...fromCell /*, toCell: newCell, storeDate */ };
            handleAddLine(newLine);
          }
        } else {
          const newLine: ICellMovementLine = { ...item, toCell: newCell /*, storeDate */ };
          handleAddLine(newLine);
          // if (docType?.includes('pallet')) {
          //   const palletId = docType.replace('pallet', '');
          //   // const document1 = palletList.find((i) => i.id === palletId);
          //   if (document1) {
          //     dispatch(
          //       documentActions.updateDocument({
          //         docId: palletId,
          //         document: {
          //           ...document1,
          //           status: 'ARCHIVE',
          //           head: { ...document1.head, toCell: newCell, storeDate },
          //         },
          //       }),
          //     );
          //   }
          // }
        }
      } else {
        const newLine: ICellMovementLine = { ...item, toCell: newCell /*, storeDate */ };
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
      hasChamberLevel,
      hasRowLevel,
      mode,
      selectedChamber,
      selectedRow,
      doc?.head.fromDepartment?.isAddressStore,
      doc?.head.documentSubtype?.id,
      doc?.head.toDepartment?.isAddressStore,
      fromCell,
      item,
      handleAddLine,
      dispatch,
      docId,
      navigation,
    ],
  );

  const handleCellPress = useCallback(
    (i: ICellData) => {
      const hasGoods = (i.goods?.length ?? 0) > 0;
      const isSelectingFromCell =
        doc?.head.fromDepartment?.isAddressStore &&
        (doc?.head.documentSubtype?.id === 'movement' || doc?.head.documentSubtype?.id === 'cellMovement') &&
        !fromCell;
      const isSelectingToCell =
        mode === 1 ||
        (fromCell && Boolean(doc?.head.toDepartment?.isAddressStore)) ||
        (!fromCell && !isSelectingFromCell);
      // Show dialog only when we are really PUTTING into a cell:
      // - never for pure 'movement' (only taking from cell)
      // - for 'internalMovement' (always put)
      // - for 'cellMovement' only when selecting destination (fromCell already chosen)
      if (hasGoods && isSelectingToCell && doc?.head.documentSubtype?.id !== 'movement') {
        setSelectedCellForDialog(i);
        setCellInfoDialogVisible(true);
      } else {
        handleSaveLine(i);
      }
    },
    [
      fromCell,
      doc?.head.fromDepartment?.isAddressStore,
      doc?.head.documentSubtype?.id,
      doc?.head.toDepartment?.isAddressStore,
      handleSaveLine,
      mode,
    ],
  );

  const handleCellInfoConfirm = useCallback(() => {
    if (selectedCellForDialog) {
      handleSaveLine(selectedCellForDialog);
      setCellInfoDialogVisible(false);
      setSelectedCellForDialog(null);
    }
  }, [selectedCellForDialog, handleSaveLine]);

  const handleCellInfoCancel = useCallback(() => {
    setCellInfoDialogVisible(false);
    setSelectedCellForDialog(null);
  }, []);

  const renderRight = useCallback(() => <InfoButton onPress={() => setVisibleDialog(true)} />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  const Cell = useCallback(
    ({ i }: { i: ICellData }) => {
      const hasGoods = (i.goods?.length ?? 0) > 0;
      const hasItemBarcode = cellHasBarcode(i, item?.barcode ?? '');
      const isFromCell = fromCell && (fromCell.fromCell === i.name || cellHasBarcode(i, fromCell.barcode ?? ''));
      const isToCell = toCell && (toCell.toCell === i.name || cellHasBarcode(i, toCell.barcode ?? ''));
      const isSelected = isFromCell || isToCell;
      const colorStyle = {
        color: isSelected
          ? cellColors.textWhite
          : defaultCell.length && defaultCell.find((e) => e === i.name)
            ? cellColors.textWhite
            : i.disabled || !hasGoods
              ? colors.backdrop
              : cellColors.textWhite,
      };
      const backColorStyle = {
        backgroundColor:
          isFromCell || isToCell
            ? colors.error
            : i.disabled
              ? colors.backdrop
              : defaultCell.length && defaultCell.find((e) => e === i.name)
                ? cellColors.default
                : hasGoods
                  ? cellColors.barcode
                  : cellColors.free,
      };

      const isSelectingFromCell =
        doc?.head.fromDepartment?.isAddressStore &&
        (doc?.head.documentSubtype?.id === 'movement' || doc?.head.documentSubtype?.id === 'cellMovement') &&
        !fromCell;
      const isSelectingToCell =
        mode === 1 ||
        (fromCell && Boolean(doc?.head.toDepartment?.isAddressStore)) ||
        (!fromCell && !isSelectingFromCell);
      const disabled = (isSelectingFromCell ? !hasItemBarcode : hasGoods && !isSelectingToCell) || Boolean(i.disabled);

      return (
        <Pressable
          key={`${i.name}-${i.sortOrder}`}
          style={({ pressed }) => [localStyles.buttons, backColorStyle, pressed && { backgroundColor: colors.accent }]}
          onPress={() => handleCellPress(i)}
          disabled={disabled}
        >
          <Text style={[localStyles.buttonLabel, colorStyle]}>{i.cell}</Text>
        </Pressable>
      );
    },
    [
      colors.accent,
      colors.backdrop,
      colors.error,
      defaultCell,
      doc?.head.documentSubtype?.id,
      doc?.head.fromDepartment?.isAddressStore,
      doc?.head.toDepartment?.isAddressStore,
      fromCell,
      handleCellPress,
      item?.barcode,
      mode,
      toCell,
    ],
  );

  // console.log('Object.keys(cellList)', Object.keys(cellList));
  const CellsColumn = useCallback(
    ({ cellData }: { cellData: ICellData[] }) => (
      <View style={styles.flexDirectionRow}>
        {cellData?.map((i) => <Cell key={`${i.name}-${i.sortOrder}`} i={i} />)}
      </View>
    ),
    [Cell],
  );
  // console.log('hasChamberLevel', hasChamberLevel);

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

  console.log('fromCell', fromCell);
  return (
    <AppScreen>
      <View style={localStyles.groupItem}>
        {fromCell ? (
          <View style={styles.alignItemsCenter}>
            <Text style={localStyles.buttonLabel}>Из {fromCell?.fromCell}</Text>
          </View>
        ) : null}
        <ScrollView>
          {hasChamberLevel && (
            <Group
              values={chamberKeys}
              onPress={(i) => setSelectedChamber(i)}
              selected={selectedChamber}
              colorBack="#d5dce3"
              colorSelected={colors.placeholder}
              title="Камера"
              heightBtn={54}
              widthBtn={106}
            />
          )}
          {selectedChamber !== undefined && hasRowLevel ? (
            <Group
              values={rowKeysForSelected}
              onPress={(i) => setSelectedRow(i)}
              selected={selectedRow}
              colorBack="#dbd5da"
              colorSelected="#854875"
              title="Ряд"
            />
          ) : null}
          {(hasRowLevel
            ? selectedChamber !== undefined && selectedRow !== undefined
            : selectedChamber !== undefined) && (
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
                      <CellsColumn key={key} /*row={key}*/ cellData={data} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <InfoDialog onOk={() => setVisibleDialog(false)} title="Ячейки" visible={visibleDialog} />
      <CellInfoDialog
        visible={cellInfoDialogVisible}
        cellData={selectedCellForDialog}
        onConfirm={handleCellInfoConfirm}
        onCancel={handleCellInfoCancel}
        lines={prihodLines}
      />
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
