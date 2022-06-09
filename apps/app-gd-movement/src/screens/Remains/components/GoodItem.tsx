import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { RemainsParamList } from '../../../navigation/Root/types';
import { IRemGood } from '../../../store/app/types';

interface IProps {
  item: IRemGood;
}

const GoodItem = ({ item }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RemainsParamList, 'GoodList'>>();

  const barcode = !!item.good.barcode;

  const textStyle = useMemo(() => [styles.field, { color: colors.text }], [colors.text]);
  const barcodeTextStyle = useMemo(
    () => [styles.number, styles.flexDirectionRow, { color: colors.text }],
    [colors.text],
  );

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoodLine', { item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item?.good.name}</Text>
          <View style={[styles.directionRow]}>
            <Text style={textStyle}>
              {item.remains} {item.good.valueName} - {(item?.price || 0).toString()} р.
            </Text>
            {barcode && <Text style={barcodeTextStyle}>{item.good.barcode}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
