import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { getDateString } from '@lib/mobile-hooks';

import { RemainsParamList } from '../../../navigation/Root/types';
import { IRemGood } from '../../../store/app/types';

interface IProps {
  item: IRemGood;
}

const GoodItem = ({ item }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<RemainsParamList, 'GoodList'>>();

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
          <LargeText style={styles.textBold}>{item?.good.name}</LargeText>
          <View style={styles.flexDirectionRow}>
            <MaterialCommunityIcons name="shopping-outline" size={18} />

            <MediumText>{item.remains} кг</MediumText>
          </View>
          <View style={styles.flexDirectionRow}>
            <MediumText>
              Партия № {item.numReceived || ''} от {getDateString(item.workDate) || ''}
            </MediumText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
