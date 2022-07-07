import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles, LargeText, MediumText } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IGood, IReturnLine } from '../../../store/types';
import { ReturnsStackParamList } from '../../../navigation/Root/types';

interface IProps {
  docId: string;
  item: IReturnLine;
  readonly?: boolean;
}

const ReturnItem = ({ docId, item, readonly = false }: IProps) => {
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();
  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('ReturnLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <LargeText style={styles.textBold}>{item.good.name}</LargeText>
          <MediumText>
            {item.quantity} {good?.valueName} x {(item.priceFromSellBill || 0).toString()} р.
          </MediumText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReturnItem;
