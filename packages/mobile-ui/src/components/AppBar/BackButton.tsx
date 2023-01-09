import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

interface IProps {
  onPress?: () => void;
}

const BackButton = ({ onPress }: IProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.viewLeft_30}>
      <IconButton icon="chevron-left" size={30} style={styles.icon_30} onPress={onPress || navigation.goBack} />
    </View>
  );
};

export default BackButton;
