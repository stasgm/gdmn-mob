import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from '@lib/mobile-ui/src/styles/global';

// import { refSelectors } from '@lib/store';

// import { IReference } from '@lib/types';

import { IOrderLine } from '../../../store/docs/types';

const OrderItem = ({ item }: { item: IOrderLine }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  // //Получить адрес item.outlet.id
  // const outlet = (refSelectors.selectByName('outlet') as IReference<IOutlet>)?.data?.find(
  //   (e) => e.id === item.,
  // );

  // const address = outlet ? outlet.address : '';

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.good.name}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{item.quantity} x 5.80 р.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
