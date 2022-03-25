import React, { ReactNode } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusType } from '@lib/types';

import styles from '../../styles/global';

import { getStatusColor } from './constants';
export interface IListItemProps {
  children?: ReactNode;
  title: string;
  documentDate: string;
  subtitle?: string;
  status?: StatusType;
  isFromRoute?: boolean;
  lineCount?: number;
  errorMessage?: string;
  id: string;
  onSelectItem?: () => void;
  documentType?: string;
}

const ScreenListItem = ({
  children,
  title,
  subtitle,
  status,
  lineCount,
  isFromRoute,
  errorMessage,
  onSelectItem,
}: IListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onSelectItem}>
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={styles.name}>{title}</Text>
          </View>
          <View style={styles.directionRow}>
            <Text style={[styles.field, { color: colors.text }]}>{subtitle ? subtitle : children}</Text>
            <View style={styles.rowCenter}>
              <Text style={[styles.field, { color: colors.text }]}>{lineCount}</Text>
              <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} style={styles.field} />
              {isFromRoute && (
                <MaterialCommunityIcons name="routes" size={15} color={colors.text} style={styles.field} />
              )}
            </View>
          </View>
          <View>
            {errorMessage && (
              <Text style={[styles.field, { color: colors.error }]}>Отказано: {errorMessage || ''}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScreenListItem;
