import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { refSelectors } from '@lib/store';
import { DataTable, IconButton } from 'react-native-paper';

import { useIsFocused, useTheme } from '@react-navigation/native';

import { formatValue, round, useFilteredDocList } from '@lib/mobile-hooks';

import { globalColors, globalStyles } from '@lib/mobile-ui';

import { IGoodGroup, IOrderDocument, IOrderLine } from '../../../store/types';
import { totalList, totalListByGroup } from '../../../utils/helpers';

export interface IItem {
  routeId: string;
  onPress: () => void;
  isGroupVisible?: boolean;
}

const RouteTotal = ({ routeId, onPress, isGroupVisible = false }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const orders = useFilteredDocList<IOrderDocument>('order');

  const orderLines = useMemo(
    () =>
      orders?.reduce((prev: IOrderLine[], order) => {
        if (order.head.route?.id === routeId) {
          prev = [...prev, ...order.lines];
        }
        return prev;
      }, []),
    [orders, routeId],
  );

  const totalListByRoute = useMemo(
    () => totalListByGroup(firstLevelGroups, groups, orderLines),
    [firstLevelGroups, groups, orderLines],
  );

  const total = useMemo(() => totalList(totalListByRoute), [totalListByRoute]);

  const borderColors = {
    borderLeftColor: colors.border,
    borderRightColor: colors.border,
    borderTopColor: colors.border,
  };

  const textColor = { color: colors.text };
  const rowStyle = [
    { minHeight: 22, borderBottomWidth: 0, borderTopWidth: isGroupVisible ? StyleSheet.hairlineWidth * 2 : 0 },
    localStyles.borderTopColor,
  ];
  const textStyle = [localStyles.cellText, textColor];
  const textBoldStyle = [textStyle, textColor, globalStyles.textBold];
  const labelStyle = { backgroundColor: colors.border, borderBottomColor: globalColors.backgroundLight };
  const totalStyle = {
    backgroundColor:
      isGroupVisible && totalListByRoute?.length % 2 === 1 ? globalColors.backgroundLight : 'transparent',
  };

  const isFocused = useIsFocused();
  if (!isFocused) {
    return <></>;
  }

  return (
    <TouchableOpacity onPress={() => !!orderLines.length && onPress()}>
      <DataTable style={[borderColors, localStyles.table]}>
        <View style={[localStyles.label, labelStyle]}>
          {!!orderLines.length && (
            <IconButton icon={isGroupVisible ? 'chevron-down' : 'chevron-up'} size={18} color={colors.text} />
          )}
        </View>
        <DataTable.Header style={[localStyles.header, headerStyle]}>
          {['Вес, кг', 'Сумма', 'Сумма с НДC'].map((i) => {
            return (
              <DataTable.Title key={i} textStyle={textBoldStyle} style={localStyles.title} numeric>
                {i}
              </DataTable.Title>
            );
          })}
        </DataTable.Header>
        {isGroupVisible
          ? totalListByRoute?.map((item, index) => {
              const groupStyle = { backgroundColor: index % 2 === 1 ? globalColors.backgroundLight : 'transparent' };
              return (
                <View key={item.group.id} style={groupStyle}>
                  <DataTable.Row style={[localStyles.row, localStyles.borderBottomColor]}>
                    <DataTable.Cell textStyle={textStyle}>{item.group.name}</DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row style={[localStyles.row, localStyles.borderBottomColor]}>
                    <DataTable.Cell textStyle={textStyle} numeric>
                      {formatValue({ type: 'number' }, round(item.quantity, 3))}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={textStyle} numeric>
                      {formatValue({ type: 'number', decimals: 2 }, round(item.sum, 2))}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={textStyle} numeric>
                      {formatValue({ type: 'number', decimals: 2 }, round(item.sumVat, 2))}
                    </DataTable.Cell>
                  </DataTable.Row>
                </View>
              );
            })
          : null}
        <View style={totalStyle}>
          <DataTable.Row style={rowStyle}>
            <DataTable.Cell textStyle={[textStyle, textBoldStyle]}>Итого</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row style={[localStyles.borderColor, localStyles.total, localStyles.paddingBottom]}>
            <DataTable.Cell textStyle={textBoldStyle} numeric>
              {formatValue({ type: 'number' }, round(total?.quantity || 0, 3))}
            </DataTable.Cell>
            <DataTable.Cell textStyle={textBoldStyle} numeric>
              {formatValue({ type: 'number', decimals: 2 }, round(total?.sum || 0, 2))}
            </DataTable.Cell>
            <DataTable.Cell textStyle={textBoldStyle} numeric>
              {formatValue({ type: 'number', decimals: 2 }, round(total?.sumVat || 0, 2))}
            </DataTable.Cell>
          </DataTable.Row>
        </View>
      </DataTable>
    </TouchableOpacity>
  );
};

export default RouteTotal;

const localStyles = StyleSheet.create({
  cellText: {
    fontSize: 15,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    fontWeight: 'bold',
  },
  row: {
    minHeight: 30,
    paddingVertical: 5,
    borderBottomWidth: 0,
  },
  title: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  total: {
    minHeight: 30,
    borderBottomWidth: 0,
  },
  label: {
    height: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  paddingBottom: {
    paddingBottom: 8,
  },
  table: {
    borderLeftWidth: StyleSheet.hairlineWidth * 2,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  borderColor: { borderColor: 'transparent' },
  borderTopColor: { borderTopColor: 'transparent' },
  borderBottomColor: { borderBottomColor: 'transparent' },
});
const headerStyle = [
  localStyles.borderColor,
  localStyles.borderBottomColor,
  localStyles.borderTopColor,
  {
    backgroundColor: globalColors.backgroundLight,
    borderTopColor: globalColors.backgroundLight,
    borderTopWidth: 0,
  },
];
