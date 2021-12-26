import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IGood, IReturnLine } from '../../../store/types';
import { ReturnsStackParamList } from '../../../navigation/Root/types';

interface IProps {
  contactId?: string;
  item: any; //IReturnLine;
  readonly?: boolean;
}

const GoodItem = ({ contactId, item, readonly = false }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnView'>>();

  console.log('item', item);

  const good = refSelectors.selectByName<IGood>('good')?.data?.find((e) => e.id === item?.id);

  return (
    <TouchableOpacity
      onPress={() => {
        !readonly && navigation.navigate('GoodLine', {contactId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item?.goodId}</Text>
          <Text style={[styles.field, { color: colors.text }]}>
            {/* {item.quantity} {good?.valuename} x {(good?.priceFsn || 0).toString()} р. */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
