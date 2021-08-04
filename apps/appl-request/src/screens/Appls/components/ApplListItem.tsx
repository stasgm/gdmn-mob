import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getStatusColor } from '../../../utils/constants';
import { ApplsStackParamList } from '../../../navigation/Root/types';
// eslint-disable-next-line import/no-cycle
import { ApplListRenderItemProps } from '../ApplListScreen';

const ApplListItem = ({
  id,
  title,
  subtitle,
  description,
  status,
  lineCount,
  applStatus,
  errorMessage,
}: ApplListRenderItemProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplList'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ApplView', { id });
      }}
    >
      <View style={[styles.flexDirectionRow, localStyles.box]}>
        <View style={[localStyles.label, { backgroundColor: getStatusColor(status || 'DRAFT') }]} />
        {/* <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="file-outline" size={20} color={'#FFF'} />
        </View> */}
        <View style={localStyles.info}>
          <Text style={styles.name}>{title}</Text>
          <Text style={[styles.textBold, styles.field]}>{applStatus}</Text>
          <View style={styles.rowBottom}>
            <Text style={[styles.number, styles.field]}>{subtitle}</Text>
            <View style={[styles.rowCenter]}>
              <Text style={[styles.number, styles.field]}>{lineCount}</Text>
              <MaterialCommunityIcons name="information-outline" size={15} color={colors.text} style={styles.field} />
            </View>
          </View>
          <Text style={[styles.number, styles.field]}>{description}</Text>
          {errorMessage && <Text style={[styles.number, localStyles.error]}>{errorMessage}</Text>}
        </View>
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
