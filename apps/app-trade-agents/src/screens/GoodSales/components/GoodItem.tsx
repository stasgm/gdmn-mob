import React from 'react';
import { View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';

import { IGood } from '../../../store/types';

interface IGoodSalesItem extends IGood {
  priceRed?: number;
}

interface IProps {
  item: IGoodSalesItem;
}

const GoodItem = ({ item }: IProps) => {
  // const navigation = useNavigation<StackNavigationProp<GoodSalesParamList, 'GoodList'>>();

  return (
    // <TouchableOpacity
    //   onPress={() => {
    //     navigation.navigate('GoodLine', { item });
    //   }}
    // >
    <View style={[styles.item]}>
      <View style={[styles.icon]}>
        <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
      </View>
      <View style={styles.details}>
        <LargeText style={styles.textBold}>{item?.name}</LargeText>
        <MediumText>
          <MediumText style={{ color: 'red' }}>{(item?.priceRed || 0).toString()} р.</MediumText> /{' '}
          {(item?.priceFsn || 0).toString()} р.
        </MediumText>
      </View>
    </View>
    // </TouchableOpacity>
  );
};

export default GoodItem;
