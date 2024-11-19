import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { MD2Theme, useTheme } from 'react-native-paper';

import { IContact } from '../../../store/types';
import { GoodMatrixStackParamList } from '../../../navigation/Root/types';

export interface IContactItem {
  item: IContact;
}

const ContactItem = ({ item }: IContactItem) => {
  const navigation = useNavigation<StackNavigationProp<GoodMatrixStackParamList, 'ContactList'>>();
  const { colors } = useTheme<MD2Theme>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoodList', { id: item?.id });
      }}
    >
      <View style={[styles.item, localStyles.line]}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[{ color: colors.text }, styles.name]}>{item?.name}</Text>
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
