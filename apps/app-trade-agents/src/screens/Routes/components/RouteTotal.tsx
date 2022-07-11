import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { globalStyles as styles, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';
import { Divider } from 'react-native-paper';

import { useTheme } from '@react-navigation/native';

import { round, useFilteredDocList } from '@lib/mobile-app';

import { IGoodGroup, IOrderDocument, IOrderLine, IRouteTotalLine } from '../../../store/types';
import { totalList, totalListByGroup } from '../../../utils/helpers';

export interface IItem {
  routeId: string;
}

const RouteTotal = ({ routeId }: IItem) => {
  const { colors } = useTheme();

  const groups = refSelectors.selectByName<IGoodGroup>('goodGroup')?.data;
  const firstLevelGroups = groups?.filter((item) => !item.parent?.id);

  const orders = useFilteredDocList<IOrderDocument>('order');

  const orderLines = useMemo(() => {
    return orders?.reduce((prev: IOrderLine[], order) => {
      if (order.head.route?.id === routeId) {
        prev = [...prev, ...order.lines];
      }
      return prev;
    }, []);
  }, [orders, routeId]);

  const totalListByRoute = useMemo(
    () => totalListByGroup(firstLevelGroups, groups, orderLines),
    [firstLevelGroups, groups, orderLines],
  );

  const total = useMemo(() => totalList(totalListByRoute), [totalListByRoute]);

  const textTotalStyle = [styles.textTotal, { color: colors.notification }];

  const renderTotalItem = useCallback(
    ({ item }: { item: IRouteTotalLine }) => (
      <View style={styles.itemNoMargin}>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <View style={styles.groupWidth}>
              <MediumText>{item.group.name}</MediumText>
            </View>
            <View style={styles.directionRow}>
              <MediumText>{item.quantity}</MediumText>
            </View>
          </View>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.total}>
      <Text style={styles.textTotal}>Итого вес, кг:</Text>
      <Divider />
      <FlatList data={totalListByRoute} keyExtractor={(_, i) => String(i)} renderItem={renderTotalItem} />
      <Divider />
      <View style={styles.bottomTotal}>
        <Text style={textTotalStyle}>{round(total?.quantity, 3) || 0}</Text>
      </View>
    </View>
  );
};

export default RouteTotal;
