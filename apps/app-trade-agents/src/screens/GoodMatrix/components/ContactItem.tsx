import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';
import { refSelectors } from '@lib/store';

import { IGood, IReturnLine } from '../../../store/types';
import { ReturnsStackParamList, GoodMatrixStackParamList } from '../../../navigation/Root/types';
import { INamedEntity } from '@lib/types';

export interface IRefItem {
  refName?: string;
  item: any;
}

const ContactItem = ({ item, refName }: IRefItem) => {
  const navigation = useNavigation();
  // console.log('ítem', item);
  // const a = item.map((i) => i.name);
  // console.log('ítaem', a);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ContactView', { id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactItem;
