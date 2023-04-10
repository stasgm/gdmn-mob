import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions, Alert, ColorValue } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { docSelectors, documentActions, refSelectors, useDispatch, useSelector } from '@lib/store';
import { globalStyles as styles, LargeText, navBackButton } from '@lib/mobile-ui';

import { useTheme } from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';

import { ICell, ICellRef, IMoveDocument, IMoveLine } from '../store/types';
import { MoveStackParamList } from '../navigation/Root/types';

import { getCellItem, getCellList } from '../utils/helpers';
import { ICellRefList, ICellData } from '../store/app/types';

export interface ICellList extends ICell, ICellRef {
  department?: string;
}

export const SelectCellScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<MoveStackParamList, 'SelectCell'>>();

  const { docId, item, mode } = useRoute<RouteProp<MoveStackParamList, 'SelectCell'>>().params;

  const doc = docSelectors.selectByDocId<IMoveDocument>(docId);

  const cells = refSelectors.selectByName<ICellRefList>('cell')?.data[0];

  const [fromCell, setFromCell] = useState<IMoveLine | undefined>(undefined);
  const [toCell, setToCell] = useState<IMoveLine | undefined>(undefined);
  const [selectedChamber, setSelectedChamber] = useState<string | undefined>('');
  const [selectedRow, setSelectedRow] = useState<string | undefined>('');

  const departId = useMemo(
    () => (doc?.head.fromDepart.isAddressStore && !fromCell ? doc?.head.fromDepart.id : doc?.head.toDepart.id),
    [doc?.head, fromCell],
  );

  const docsLines = (
    useSelector((state) => state.documents.list)?.filter(
      (i) =>
        i.documentType?.name === 'movement' &&
        i.status !== 'PROCESSED' &&
        (i?.head?.fromDepart.id === departId || i?.head?.toDepart.id === departId),
    ) as IMoveDocument[]
  ).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

  const lines = docsLines.reduce((prev: IMoveLine[], cur) => {
    prev = [...prev, ...cur.lines];
    return prev;
  }, []);

  const cellList = getCellList(cells[departId || ''] || [], lines || []);

  const { colors } = useTheme();

  const windowWidth = useWindowDimensions().width;
  const groupButtonStyle = useMemo(
    () => ({
      width: windowWidth > 550 ? '21.5%' : '29.5%',
    }),
    [windowWidth],
  );

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

  const handleSaveLine = (cellData: ICellData, tier: string) => {
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
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackButton,
    });
  }, [navigation]);

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
            {values.map((i) => {
              const colorStyle = { color: selected === i ? 'white' : colors.text };
              const backColorStyle = { backgroundColor: selected === i ? colorSelected : colorBack };
              return (
                <TouchableOpacity
                  key={i}
                  style={[localStyles.button, backColorStyle, groupButtonStyle]}
                  onPress={() => onPress(i)}
                >
                  <Text style={[localStyles.buttonLabel, colorStyle]}>{i}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    },
    [OFFSET, colors.text, groupButtonStyle, windowWidth],
  );

  if (!doc) {
    return (
      <View style={[styles.container, styles.alignItemsCenter]}>
        <LargeText>Документ не найден</LargeText>
      </View>
    );
  }

  return (
    <View style={localStyles.groupItem}>
      {fromCell ? (
        <View>
          <Text> Из ячейки {fromCell?.fromCell} </Text>
        </View>
      ) : null}
      <ScrollView>
        <Group
          values={Object.keys(cellList)}
          onPress={(i) => setSelectedChamber(i)}
          selected={selectedChamber}
          colorBack="#d5dce3"
          colorSelected={colors.placeholder}
          title="Камера"
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
          <View style={styles.flexDirectionRow}>
            <View style={styles.directionColumn}>
              {Object.keys(cellList[selectedChamber][selectedRow])
                .reverse()
                .map((row) => {
                  return (
                    <View key={row} style={[localStyles.flexColumn, localStyles.height]}>
                      <View style={[localStyles.row]}>
                        <Text style={localStyles.buttonLabel}>{row}</Text>
                      </View>
                    </View>
                  );
                })}
            </View>
            <ScrollView horizontal>
              <View style={styles.directionColumn}>
                {Object.entries(cellList[selectedChamber][selectedRow])
                  .reverse()
                  .map(([row, celll]) => {
                    const colorBack = '#d5dce3';
                    return (
                      <View key={row} style={styles.flexDirectionRow}>
                        {celll?.map((i) => {
                          const colorStyle1 = {
                            color: i.disabled || !i.barcode ? colors.backdrop : 'white',
                          };
                          const backColorStyle1 = {
                            backgroundColor:
                              (fromCell && fromCell.barcode === i.barcode) || (toCell && toCell.barcode === i.barcode)
                                ? colors.notification
                                : i.barcode
                                ? '#226182'
                                : i.disabled
                                ? colors.disabled
                                : colorBack,
                          };
                          return (
                            <TouchableOpacity
                              key={i.name}
                              style={[localStyles.buttons, backColorStyle1]}
                              onPress={() => handleSaveLine(i, row)}
                              disabled={
                                (doc.head.fromDepart.isAddressStore && !fromCell ? !i.barcode : Boolean(i.barcode)) ||
                                i.disabled
                              }
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
        )}
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  groupItem: {
    marginBottom: 2,
    flex: 1,
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

/* <View style={{ flex: 1 }}>
<FlashList
  data={Object.entries(cellList[selectedChamber][selectedRow]).reverse()}
  renderItem={renderGood}
  // ListHeaderComponent={filterVisible ? undefined : renderGroupHeader}
  estimatedItemSize={78}
  // ItemSeparatorComponent={ItemSeparator}
  keyExtractor={keyExtractor}
  extraData={[
    colors.backdrop,
    colors.disabled,
    colors.notification,
    doc?.head.fromDepart.isAddressStore,
    fromCell,
    handleSaveLine,
    toCell,
  ]}
/>
</View> */

// const renderGood = useCallback(
//   ({ item }: { item: any }) => {
//     const row = item?.[0];
//     console.log('row, ', row);
//     const celll = item?.[1];
//     // console.log('1235', jsonFormat(item));
//     const colorBack = '#d5dce3';
//     return (
//       <View key={row} style={styles.flexDirectionRow}>
//       {celll?.map((i) => {
//           const colorStyle1 = {
//             color: i.disabled || !i.barcode ? colors.backdrop : 'white',
//           };
//           const backColorStyle1 = {
//             backgroundColor:
//               (fromCell && fromCell.barcode === i.barcode) || (toCell && toCell.barcode === i.barcode)
//                 ? colors.notification
//                 : i.barcode
//                 ? '#226182'
//                 : i.disabled
//                 ? colors.disabled
//                 : colorBack,
//           };
//           return (
//             <TouchableOpacity
//               key={i.name}
//               style={[localStyles.buttons, backColorStyle1]}
//               onPress={() => handleSaveLine(i, row)}
//               disabled={
//                 (doc.head.fromDepart.isAddressStore && !fromCell ? !i.barcode : Boolean(i.barcode)) || i.disabled
//               }
//             >
//               <Text style={[localStyles.buttonLabel, colorStyle1]}>{i.cell}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     );
//   },
//   [
//     colors.backdrop,
//     colors.disabled,
//     colors.notification,
//     doc?.head.fromDepart.isAddressStore,
//     fromCell,
//     handleSaveLine,
//     toCell,
//   ],
// );
