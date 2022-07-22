import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusType } from '@lib/types';

import styles from '../../styles/global';

import { LargeText, MediumText } from '../AppText';

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
  onSelectItem: () => void;
  onCheckItem?: () => void;
  isChecked?: boolean;
  isDelList?: boolean;
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
            <View style={styles.checkedIcon}>
              <MaterialCommunityIcons name="check" size={11} color={'#FFF'} />
            </View>
          ) : null}
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <LargeText style={styles.textBold}>{title}</LargeText>
          </View>
          <View style={styles.directionRow}>
            {subtitle ? <MediumText>{subtitle}</MediumText> : null}
            {children ? <View style={{ width: '95%' }}>{children}</View> : null}
            <View style={styles.rowCenter}>
              <MediumText>{lineCount}</MediumText>
              <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} style={styles.field} />
              {isFromRoute && (
                <MaterialCommunityIcons name="routes" size={15} color={colors.text} style={styles.field} />
              )}
            </View>
          </View>
          {errorMessage ? (
            <MediumText style={{ color: colors.error }}>Отказано: {errorMessage || ''}</MediumText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScreenListItem;
