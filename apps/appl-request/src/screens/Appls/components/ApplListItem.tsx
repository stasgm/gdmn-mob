import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { globalStyles as styles } from '@lib/mobile-ui';

import { getStatusColor } from '../../../utils/constants';
import { ApplsStackParamList } from '../../../navigation/Root/types';
// eslint-disable-next-line import/no-cycle
import { ApplListRenderItemProps } from '../ApplListScreen';

const ApplListItem = ({ id, title, subtitle, description, status, lineCount, applStatus }: ApplListRenderItemProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ApplsStackParamList, 'ApplList'>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ApplView', { id });
      }}
    >
      <View style={styles.item}>
        <View style={[styles.icon, { backgroundColor: getStatusColor(status || 'DRAFT') }]}>
          <MaterialCommunityIcons name="file-outline" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.rowCenter}>
            <Text style={styles.name}>{title}</Text>
            <Text style={[styles.textBold, styles.field]}>{applStatus}</Text>
          </View>
          <View style={styles.rowBottom}>
            <View>
              <Text style={[styles.number, styles.field]}>{subtitle}</Text>
              <Text style={[styles.number, styles.field]}>{description}</Text>
            </View>
            <View style={[styles.rowCenter]}>
              <Text style={[styles.number, styles.field]}>{lineCount}</Text>
              <MaterialCommunityIcons name="information-outline" size={15} color={colors.text} style={styles.field} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApplListItem;
