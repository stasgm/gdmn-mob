import React, { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles as styles } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { IDepartment } from '@lib/types';

import { MD2Theme, useTheme } from 'react-native-paper';

import { CellsStackParamList } from '../../../navigation/Root/types';
import { ICellData, IEmployee, IModelData } from '../../../store/app/types';
import { cellColors } from '../../../utils/constants';
import { IMoveLine } from '../../../store/types';
import { alertWithSound } from '../../../utils/helpers';

export interface IContactItem {
  item: IDepartment | IEmployee;
}

const NamedRow = ({ item }: { item: string }) => (
  <View key={item} style={[localStyles.flexColumn, localStyles.height]}>
    <TouchableOpacity style={localStyles.row}>
      <Text style={localStyles.buttonLabel}>{item}</Text>
    </TouchableOpacity>
  </View>
);

const handleAlert = (label: string, text: string) => {
  alertWithSound(label, `Рекомендуется: ${text}.`);
};

const Cells = ({
  lines,
  cellList,
  getScannedObject,
  selectedChamber,
  selectedRow,
}: {
  lines: IMoveLine[];
  cellList: IModelData;
  getScannedObject: (brc: string, cell: string) => IMoveLine;
  selectedChamber: string;
  selectedRow: string;
}) => {
  const navigation = useNavigation<StackNavigationProp<CellsStackParamList, 'ContactList'>>();
  const { colors } = useTheme<MD2Theme>();

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
      <View style={styles.flexDirectionRow}>{data?.map((item) => <Cell key={item.name} item={item} />)}</View>
    ),
    [Cell],
  );

  const cellsByRow = useMemo(
    () => (selectedChamber && selectedRow ? Object.entries(cellList?.[selectedChamber][selectedRow])?.reverse() : []),
    [cellList, selectedChamber, selectedRow],
  );

  return (
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
  );
};

export default memo(Cells);

const localStyles = StyleSheet.create({
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
