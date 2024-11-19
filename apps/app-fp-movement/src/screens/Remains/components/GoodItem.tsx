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
          <LargeText style={[styles.textBold, { color: colors.inversePrimary }]}>{item?.good.name}</LargeText>
          <View style={styles.directionRow}>
            <View style={styles.flexDirectionRow}>
              <MaterialCommunityIcons name="shopping-outline" size={18} color={colors.onSurface} />

              <MediumText>{item.remains} кг</MediumText>
            </View>
            <MediumText>{item.good.shcode}</MediumText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
