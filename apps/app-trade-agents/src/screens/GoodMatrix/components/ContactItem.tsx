import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles as styles } from '@lib/mobile-ui';

export interface IRefItem {
  item: any;
}

const ContactItem = ({ item }: IRefItem) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ContactView', { id: item.id });
      }}
    >
      <View style={(styles.item, localStyles.line)}>
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

export const localStyles = StyleSheet.create({
  line: {
    marginVertical: 7,
    flexDirection: 'row',
  },
});
