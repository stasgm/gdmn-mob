import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { INamedEntity } from '@lib/types';

import { styles } from '../styles';
import { ReferenceStackParamList } from '../../../navigation/Root/types';

export interface IRefItem {
  refName: string;
  item: INamedEntity;
}

type ViewScreenProp = StackNavigationProp<ReferenceStackParamList, 'ReferenceDetals'>;

const ReferenceItem = ({ item, refName }: IRefItem) => {
  const navigation = useNavigation<ViewScreenProp>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReferenceDetals', { name: refName, id: item.id });
      }}
    >
      <View style={styles.item}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{item.name || item.id}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReferenceItem;
