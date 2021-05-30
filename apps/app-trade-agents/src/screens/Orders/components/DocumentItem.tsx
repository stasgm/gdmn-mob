import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { styles } from '../styles';
import { IOrderDocument } from '../../../store/docs/types';

const DocumentItem = ({ item }: { item: IOrderDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

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
          {/* <View style={styles.directionRow}> */}
          <Text style={[styles.name, { color: colors.text }]}>{`№ ${item.number} от ${item.documentDate}`}</Text>
          {/* </View> */}
          {/* <View style={styles.directionRow}> */}
          {/* <Text style={[styles.field, { color: colors.text }]}>{item.head.contact.name}</Text> */}
          <Text style={[styles.field, { color: colors.text }]}>
            {`${item.head.outlet.name} (${item.head.contact.name})`}
          </Text>
          {/* </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentItem;
