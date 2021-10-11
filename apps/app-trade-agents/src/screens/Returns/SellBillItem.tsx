import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IGood, ISellBillLine } from '../../store/types';
import { SellBillsStackParamList } from '../../navigation/Root/types';

interface IProps {
  docId: string;
  item: ISellBillLine;
  readonly?: boolean;
}

const SellBillItem = ({ docId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<SellBillsStackParamList, 'SellBillView'>>();

  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.good.id);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('SellBillLine', { mode: 1, docId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.good.name}</Text>
          <Text style={[styles.field, { color: colors.text }]}>
            {item.quantity} {good?.valuename} x {(good?.priceFsn || 0).toString()} р.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SellBillItem;
