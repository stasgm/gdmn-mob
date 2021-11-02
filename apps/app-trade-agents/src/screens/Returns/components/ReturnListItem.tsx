import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { globalStyles as styles } from '@lib/mobile-ui';
import { StatusType } from '@lib/types';

import { getStatusColor } from '../../../utils/constants';
import { ReturnsStackParamList } from '../../../navigation/Root/types';

export interface IReturnListItemProps {
  title: string;
  documentDate: string;
  subtitle?: string;
  status?: StatusType;
  isFromRoute?: boolean;
  lineCount?: number;
}
export interface IReturnListRenderItemProps extends IReturnListItemProps {
  id: string;
}

const ReturnListItem = ({ id, title, subtitle, status, lineCount, isFromRoute }: IReturnListRenderItemProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ReturnsStackParamList, 'ReturnList'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReturnView', { id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{title}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{subtitle}</Text>
            <View style={styles.rowCenter}>
              <Text style={[styles.field, { color: colors.text }]}>{lineCount}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} style={styles.field} />
              {isFromRoute && (
                <MaterialCommunityIcons name="routes" size={15} color={colors.text} style={styles.field} />
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReturnListItem;
