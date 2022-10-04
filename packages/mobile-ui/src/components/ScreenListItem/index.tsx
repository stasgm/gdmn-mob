import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusType } from '@lib/types';

import styles from '../../styles/global';

import { LargeText, MediumText } from '../AppText';

import { getStatusColor, getStatusIcon } from './constants';
export interface IListItemProps {
  title: string;
  documentDate: string;
  errorMessage?: string;
  id: string;
  onPress: () => void;
  onLongPress?: () => void;
  subtitle?: string;
  isFromRoute?: boolean;
  status?: StatusType;
  checked?: boolean;
  documentType?: string;
  lineCount?: number;
  children?: ReactNode;
  addInfo?: ReactNode;
}

const ScreenListItem = ({
  children,
  title,
  subtitle,
  status = 'DRAFT',
  lineCount,
  isFromRoute,
  errorMessage,
  onPress,
  onLongPress,
  checked,
  addInfo,
}: IListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.item}>
        <View style={styles.iconsWithCheck}>
          <View style={styles.iconWithoutBackground}>
            <MaterialCommunityIcons name={getStatusIcon(status)} size={25} color={getStatusColor(status)} />
          </View>
          {checked ? (
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
            {addInfo ? <View style={{ width: '90%' }}>{addInfo}</View> : null}
            <View style={styles.rowCenter}>
              <MediumText>{lineCount}</MediumText>
              <MaterialCommunityIcons name="shopping-outline" size={15} color={colors.text} style={styles.field} />
              {isFromRoute && (
                <MaterialCommunityIcons name="routes" size={15} color={colors.text} style={styles.field} />
              )}
            </View>
          </View>
          {children}
          {errorMessage ? (
            <MediumText style={{ color: colors.error }}>Отказано: {errorMessage || ''}</MediumText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScreenListItem;
