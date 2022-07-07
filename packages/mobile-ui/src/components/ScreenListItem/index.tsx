import React, { ReactNode } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusType } from '@lib/types';

import styles from '../../styles/global';

import { getStatusColor } from './constants';
export interface IListItemProps {
  children?: ReactNode;
  info?: ReactNode;
  title: string;
  documentDate: string;
  subtitle?: string;
  status?: StatusType;
  isFromRoute?: boolean;
  lineCount?: number;
  errorMessage?: string;
  id: string;
  onSelectItem?: () => void;
  onCheckItem?: () => void;
  isChecked?: boolean;
  isDelList?: boolean;
  documentType?: string;
}

const ScreenListItem = ({
  children,
  info,
  title,
  subtitle,
  status,
  lineCount,
  isFromRoute,
  errorMessage,
  onSelectItem,
  onCheckItem,
  isChecked,
  isDelList,
}: IListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        isDelList ? onCheckItem && onCheckItem() : onSelectItem && onSelectItem();
      }}
      onLongPress={onCheckItem}
    >
      <View style={styles.item}>
        <View style={styles.iconsWithCheck}>
          <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
            <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
          </View>
          {isChecked ? (
            <View style={[styles.checkedIcon]}>
              <MaterialCommunityIcons name="check" size={11} color={'#FFF'} />
            </View>
          ) : null}
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
          {info && <View>{info}</View>}
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
