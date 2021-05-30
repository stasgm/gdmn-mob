import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { styles } from '../styles';
import { IRouteDocument } from '../../../store/docs/types';

const DocumentItem = ({ item }: { item: IRouteDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RouteView', { id: item.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{`№ ${item.number} от ${item.documentDate}`}</Text>
          <Text style={[styles.field, { color: colors.text }]}>{`${item.head.agent.name}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentItem;
