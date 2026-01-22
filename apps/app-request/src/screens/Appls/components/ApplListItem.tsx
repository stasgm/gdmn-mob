import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MD2Theme, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';
import { StatusType } from '@lib/types';

import { getStatusColor } from '../../../utils/constants';
import { ApplsStackParamList } from '../../../navigation/Root/types';

export interface ApplListProps {
  Appl: ApplListRenderItemProps[];
}

export interface ApplListRenderItemProps extends ApplListItemProps {
  id: string;
}

export interface ApplListItemProps {
  documentDate: string;
  title: string;
  dept: string;
  subtitle?: string;
  description?: string;
  status?: StatusType;
  applStatus: string;
  isFromRoute?: boolean;
  lineCount?: number;
  errorMessage?: string;
}

const ApplListItem = ({
  id,
  title,
  dept,
  subtitle,
  description,
  status,
  lineCount,
  applStatus,
  errorMessage,
}: ApplListRenderItemProps) => {
  const { colors } = useTheme<MD2Theme>();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplList'>>();

  return (
    <TouchableOpacity
      key={id}
      onPress={() => {
        navigation.navigate('ApplView', { id });
      }}
      style={[styles.flexDirectionRow, localStyles.box]}
    >
      <View style={[localStyles.label, { backgroundColor: getStatusColor(status || 'DRAFT') }]} />
      <View style={localStyles.info}>
        <Text style={[styles.textBold, styles.textDescription]}>{dept}</Text>
        {/* <Divider /> */}
        <Text style={[styles.name]}>{title}</Text>
        <Text style={[styles.textBold, styles.field]}>{applStatus}</Text>
        <View style={styles.rowBottom}>
          <Text style={[styles.number, styles.field]}>{subtitle}</Text>
          <View style={[styles.rowCenter]}>
            <Text style={[styles.number, styles.field]}>{lineCount}</Text>
            <MaterialCommunityIcons name="information-outline" size={15} color={colors.text} style={styles.field} />
          </View>
        </View>
        <Text style={[styles.number, styles.field]}>{description}</Text>
        {errorMessage && <Text style={[styles.number, localStyles.error]}>{errorMessage || ''}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  box: {
    borderColor: '#8888',
    borderRadius: 5,
    borderWidth: 0.5,
    marginVertical: 4,
  },
  info: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
  },
  label: {
    width: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'right',
  },
});

export default ApplListItem;
