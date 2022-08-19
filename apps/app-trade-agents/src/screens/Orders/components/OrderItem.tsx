import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText, globalColors } from '@lib/mobile-ui';

import { useTheme } from '@react-navigation/native';

import { IOrderLine } from '../../../store/types';

interface IProps {
  sortId: number;
  item: IOrderLine;
  onPress: () => void;
  onLongPress?: () => void;
  isChecked?: boolean;
  isDelList?: boolean;
}

const OrderItem = ({ item, onPress, onLongPress, isChecked, isDelList, sortId }: IProps) => {
  const { colors } = useTheme();
  const backgroundColor = { backgroundColor: sortId % 2 === 0 ? globalColors.backgroundLight : colors.background };

  return (
    <TouchableOpacity onPress={isDelList ? onLongPress : onPress} onLongPress={onLongPress}>
      <View style={backgroundColor}>
        <View style={[styles.item]}>
          <View style={[styles.iconsWithCheck]}>
            <View style={[styles.icon]}>
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
                {item.quantity} {(item.good.scale || 1) === 1 ? '' : 'уп. / ' + (item.good.scale || 1).toString()}
                {'кг  /  '}
                {(item.good.priceFsn || 0).toString()} р.
              </MediumText>
            </View>
            {item.package ? <MediumText>Упаковка: {item.package?.name}</MediumText> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
