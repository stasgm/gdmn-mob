import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { IOrderLine } from '../../../store/types';

interface IProps {
  item: IOrderLine;
  onPress: () => void;
}

const OrderItem = ({ item, onPress }: IProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <View style={styles.directionRow}>
            <MediumText>
              {item.quantity} {(item.good.scale || 1) === 1 ? '' : 'уп. / ' + (item.good.scale || 1).toString()}
              {'кг  /  '}
              {(item.good.priceFsn || 0).toString()} р.
            </MediumText>
          </View>
          {item.package ? <MediumText>Упаковка: {item.package?.name}</MediumText> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
