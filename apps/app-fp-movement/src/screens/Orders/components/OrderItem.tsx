import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { getDateString } from '@lib/mobile-app';

import { IGood, IOrderLine } from '../../../store/types';
import { OrderStackParamList } from '../../../navigation/Root/types';

interface IProps {
  docId: string;
  item: IOrderLine;
  readonly?: boolean;
}

const OrderItem = ({ docId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<OrderStackParamList, 'OrderView'>>();

  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('OrderLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={textStyle}>Вес: {(item.weight || 0).toString()} кг</Text>
          </View>
          <Text style={textStyle}>Номер партии: {item.numReceived || ''}</Text>

          <Text style={textStyle}>
            Дата: {getDateString(item.workDate) || ''} {new Date(item.workDate).toLocaleTimeString() || ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
