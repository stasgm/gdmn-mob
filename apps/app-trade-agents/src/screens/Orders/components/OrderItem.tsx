import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyles as styles } from '@lib/mobile-ui';

import { refSelectors } from '@lib/store';
import { IReference } from '@lib/types';

import { IGood, IOrderLine } from '../../../store/docs/types';

interface IProps {
  docId: string;
  item: IOrderLine;
}

const OrderItem = ({ docId, item }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const good = (refSelectors.selectByName('good') as IReference<IGood>)?.data?.find((e) => e.id === item?.good.id);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.good.name}</Text>
          <Text style={[styles.field, { color: colors.text }]}>
            {item.quantity} {good?.valuename} x {(good?.priceFsn || 0).toString()} р.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
