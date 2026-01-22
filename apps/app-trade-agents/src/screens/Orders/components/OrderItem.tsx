import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { IOrderLine } from '../../../store/types';

interface IProps {
  item: IOrderLine;
  onPress: () => void;
  onLongPress?: () => void;
  isChecked?: boolean;
  isDelList?: boolean;
}

const OrderItem = ({ item, onPress, onLongPress, isChecked, isDelList }: IProps) => (
  <TouchableOpacity onPress={isDelList ? onLongPress : onPress} onLongPress={onLongPress}>
    <View style={styles.item}>
      <View style={styles.iconsWithCheck}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        {isChecked ? (
          <View style={[styles.checkedIcon]}>
            <MaterialCommunityIcons name="check" size={11} color={'#FFF'} />
          </View>
        ) : null}
      </View>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item.good.name}</LargeText>
        <View style={styles.directionRow}>
          <MediumText>
            {item.quantity} {'кг  /  '} {(item.good.priceFsn || 0).toString()} р.
          </MediumText>
        </View>
        {item.package ? <MediumText>Упаковка: {item.package?.name}</MediumText> : null}
      </View>
    </View>
  </TouchableOpacity>
);

export default OrderItem;
