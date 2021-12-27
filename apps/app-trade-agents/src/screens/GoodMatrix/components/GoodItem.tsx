import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { GoodMatrixParamList } from '../../../navigation/Root/types';
import { IMatrixDataNamed } from '../../../store/types';

interface IProps {
  contactId: string | undefined;
  item: IMatrixDataNamed | undefined; //IReturnLine
}

const GoodItem = ({ contactId, item }: IProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<GoodMatrixParamList, 'ContactView'>>();

  console.log('item', item);

  // const good = refSelectors.selectByName<IGood>('good')?.data.find((e) => e.id === item?.goodId);

  // console.log('good', good);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoodLine', { contactId, item });
      }}
    >
      <View style={[styles.item]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item?.goodName}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{(item?.priceFsn || 0).toString()} р.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GoodItem;
