import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  onPress: () => void;
  disabled?: boolean;
}

const SaveDocument = ({ onPress, disabled }: IProps) => (
  <View style={styles.viewRight_30}>
    <IconButton icon="content-save-outline" size={30} style={styles.icon_30} onPress={onPress} disabled={disabled} />
  </View>
);

export default SaveDocument;
