import React from 'react';
import { v4 as uuid } from 'uuid';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';
import { INamedEntity } from '@lib/types';

import { ReturnsStackParamList } from '../../../navigation/Root/types';
import { getDateString } from '../../../utils/helpers';

interface IProps {
  item: ISellBillListRenderItemProps;
}

export interface ISellBillListRenderItemProps {
  docId: string;
  quantity: number;
  price: number;
  number: string;
  documentdate: string;
  contract?: string;
  departName?: string;
  valueName: string;
  readonly: boolean;
  good: INamedEntity;
  sellBillId: string;
}

const SellBillItem = ({ item }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'SellBill'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        !item.readonly &&
          navigation.navigate('ReturnLine', {
            mode: 0,
            docId: item.docId,
            item: {
              good: item.good,
              quantityFromSellBill: item.quantity,
              priceFromSellBill: item.price,
              quantity: 0,
              id: uuid(),
              sellBillId: item.sellBillId,
            },
          });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{`№ ${item.number} ${getDateString(
            item.documentdate,
          )}`}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{`Договор №${item.contract}`}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{item.departName}</Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {item.quantity} {item.valueName} x {item.price} р.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SellBillItem;
