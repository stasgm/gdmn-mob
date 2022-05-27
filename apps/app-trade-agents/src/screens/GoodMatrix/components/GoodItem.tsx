import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { GoodMatrixParamList } from '../../../navigation/Root/types';
import { IGood } from '../../../store/types';

interface IProps {
  item: IGood;
}

const GoodItem = ({ item }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<GoodMatrixParamList, 'GoodList'>>();

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
          <Text style={[styles.name, { color: colors.text }]}>{item?.name}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{(item?.priceFsn || 0).toString()} р.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
