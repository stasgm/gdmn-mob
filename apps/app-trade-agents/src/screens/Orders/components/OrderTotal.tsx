import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { refSelectors } from '@lib/store';
import { DataTable, IconButton } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { formatValue, round } from '@lib/mobile-app';

import { IGoodGroup, IOrderDocument } from '../../../store/types';
import { totalList, totalListByGroup } from '../../../utils/helpers';

export interface IItem {
  order: IOrderDocument;
  isGroupVisible: boolean;
  onPress: () => void;
}

const OrderTotal = ({ order, isGroupVisible, onPress }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const totalListByOrder = useMemo(
    () => totalListByGroup(firstLevelGroups, groups, order.lines),
    [firstLevelGroups, groups, order.lines],
  );

  const headerStyle = [{ borderColor: colors.border, borderBottomColor: colors.border, borderTopColor: colors.border }];
  const textColor = { color: colors.text };
  const borderColor = { borderColor: colors.border };
  const borderTopColor = { borderTopColor: colors.border };
  const borderBottomColor = { borderBottomColor: colors.border };
  const rowStyle = [
    localStyles.total,
    borderTopColor,
    { borderTopWidth: isGroupVisible ? StyleSheet.hairlineWidth * 2 : 0 },
  ];
  const textStyle = [localStyles.cellText, textColor];
  const textBoldStyle = [textStyle, textColor];

  const total = useMemo(() => totalList(totalListByOrder), [totalListByOrder]);

  return (
    <View>
      <IconButton
        icon={isGroupVisible ? 'chevron-down' : 'chevron-up'}
        size={22}
        onPress={onPress}
        color={colors.text}
        style={localStyles.icon}
      />
      <DataTable style={borderColor}>
        <DataTable.Header style={[localStyles.header, headerStyle, { backgroundColor: colors.border }]}>
          {['Вес, кг', 'Сумма', 'Сумма с НДC'].map((i) => {
            return (
              <DataTable.Title key={i} textStyle={textBoldStyle} style={localStyles.title} numeric>
                {i}
              </DataTable.Title>
            );
          })}
        </DataTable.Header>

        {isGroupVisible
          ? totalListByOrder.map((item) => {
              return (
                <View key={item.group.id}>
                  <DataTable.Row style={[localStyles.row, borderBottomColor]}>
                    <DataTable.Cell textStyle={textStyle}>{item.group.name}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row style={[localStyles.row, borderBottomColor]}>
                    <DataTable.Cell textStyle={textStyle} numeric>
                      {round(item.quantity, 3)}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={textStyle} numeric>
                      {formatValue({ type: 'number', decimals: 2 }, round(item.sum, 2))}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={textBoldStyle} numeric>
                      {formatValue({ type: 'number', decimals: 2 }, round(item.sumVat, 2))}
                    </DataTable.Cell>
                  </DataTable.Row>
                </View>
              );
            })
          : null}

        <DataTable.Row style={rowStyle}>
          <DataTable.Cell textStyle={textStyle}>Итого</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row style={[borderColor, localStyles.total, localStyles.totalMargin]}>
          <DataTable.Cell textStyle={textBoldStyle} numeric>
            {round(total?.quantity, 3)}
          </DataTable.Cell>
          <DataTable.Cell textStyle={textBoldStyle} numeric>
            {formatValue({ type: 'number', decimals: 2 }, round(total?.sum, 2))}
          </DataTable.Cell>
          <DataTable.Cell textStyle={textBoldStyle} numeric>
            {formatValue({ type: 'number', decimals: 2 }, round(total?.sumVat, 2))}
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};

export default OrderTotal;

const localStyles = StyleSheet.create({
  cellText: {
    fontSize: 14,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 33,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
  row: {
    minHeight: 22,
    borderBottomWidth: 0,
  },
  title: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  total: {
    minHeight: 20,
    borderBottomWidth: 0,
  },
  totalMargin: {
    marginTop: -8,
  },
  icon: {
    top: -6,
    zIndex: 1,
    position: 'absolute',
    marginBottom: 10,
  },
});
