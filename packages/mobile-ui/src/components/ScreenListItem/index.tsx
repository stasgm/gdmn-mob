import React, { ReactNode } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MD2Theme, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusType } from '@lib/types';
import { getDateString } from '@lib/mobile-hooks';

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
  sentDate?: string;
  erpCreationDate?: string;
}

const ScreenListItem = ({
  children,
  title,
  subtitle,
  status = 'DRAFT',
  lineCount,
  isFromRoute,
  errorMessage,
  sentDate,
  erpCreationDate,
  onPress,
  onLongPress,
  checked,
  addInfo,
}: IListItemProps) => {
  const { colors } = useTheme<MD2Theme>();

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
          <LargeText style={styles.textBold}>{title}</LargeText>
          <View style={styles.directionRow}>
            <View style={localStyles.info}>
              {subtitle ? <MediumText>{subtitle}</MediumText> : null}
              {addInfo ? <View>{addInfo}</View> : null}
            </View>
            <View style={localStyles.quant}>
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
          {sentDate ? (
            <MediumText>
              Отправлено: {getDateString(sentDate)} {new Date(sentDate).toLocaleTimeString()}
            </MediumText>
          ) : null}
          {erpCreationDate ? (
            <MediumText>
              Обработано: {getDateString(erpCreationDate)} {new Date(erpCreationDate).toLocaleTimeString()}
            </MediumText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  info: {
    width: '75%',
  },
  quant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default ScreenListItem;
