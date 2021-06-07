import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import { IReference } from '@lib/types';

import { styles } from '../styles';
import { ReferenceStackParamList } from '../../../navigation/Root/types';

export type RefListItem = IReference & { refName: string };

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceView'>;

const ReferenceListItem = ({ item }: { item: RefListItem }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<ViewScreenProp>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReferenceView', { name: item.refName });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.background }]}>
        <View style={[styles.icon]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name || item.refName}</Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>Размер: {item.data.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReferenceListItem;
