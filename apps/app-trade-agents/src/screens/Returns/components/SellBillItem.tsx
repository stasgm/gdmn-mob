import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { INamedEntity } from '@lib/types';

import { v4 as uuid } from 'uuid';

import { ISellBill } from '../../../store/types';
import { ReturnsStackParamList } from '../../../navigation/Root/types';
import { getDateString } from '../../../utils/helpers';

interface IProps {
  docId: string;
  item: ISellBill;
  valueName: string;
  readonly?: boolean;
  good: INamedEntity;
}

const SellBillItem = ({ docId, item, valueName, good, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SellBill'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly &&
          navigation.navigate('ReturnLine', {
            mode: 0,
            docId,
            item: { good, quantityFromSellBill: item.QUANTITY, priceFromSellBill: item.PRICE, quantity: 0, id: uuid() },
          });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{`№ ${item.NUMBER} ${getDateString(
            item.DOCUMENTDATE,
          )}`}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{`Договор №${item.CONTRACT}`}</Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.QUANTITY} {valueName} x {item.PRICE} р.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SellBillItem;
