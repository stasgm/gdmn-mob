import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { GoodMatrixParamList } from '../../../navigation/Root/types';
import { IGood } from '../../../store/types';

interface IProps {
  item: IGood;
}

const GoodItem = ({ item }: IProps) => {
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
          <LargeText style={styles.textBold}>{item?.name}</LargeText>
          <MediumText>{(item?.priceFsn || 0).toString()} р.</MediumText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
