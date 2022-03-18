import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { IDepartment } from '@lib/types';

import { RemainsStackParamList } from '../../../navigation/Root/types';
import { IEmployee } from '../../../store/app/types';

export interface IContactItem {
  item: IDepartment | IEmployee;
}

const ContactItem = ({ item }: IContactItem) => {
  const navigation = useNavigation<StackNavigationProp<RemainsStackParamList, 'ContactList'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoodList', { id: item?.id });
      }}
    >
      <View style={(styles.item, localStyles.line)}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item?.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactItem;

export const localStyles = StyleSheet.create({
  line: {
    marginVertical: 7,
    flexDirection: 'row',
  },
});
