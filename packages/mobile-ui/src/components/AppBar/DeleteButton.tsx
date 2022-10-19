import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  onPress: () => void;
}

export const DeleteButton = ({ onPress }: IProps) => (
  <View style={styles.viewRight_30}>
    <IconButton icon="delete-outline" size={30} style={styles.icon_30} onPress={onPress} />
  </View>
);
