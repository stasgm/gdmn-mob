import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { useTheme } from 'react-native-paper';

import { RemainsParamList } from '../../../navigation/Root/types';
import { IRemGood } from '../../../store/app/types';

interface IProps {
  item: IRemGood;
}

const GoodItem = ({ item }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<RemainsParamList, 'GoodList'>>();
  const { colors } = useTheme();

  const barcode = !!item.good.barcode;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoodLine', { item });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <LargeText style={[styles.textBold, { color: colors.onSurface }]}>{item?.good.name}</LargeText>
          <View style={styles.directionRow}>
            <MediumText>
              {item.remains} {item.good.valueName} - {(item?.price || 0).toString()} р.
            </MediumText>
            {barcode && <MediumText style={[styles.number, styles.flexDirectionRow]}>{item.good.barcode}</MediumText>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
