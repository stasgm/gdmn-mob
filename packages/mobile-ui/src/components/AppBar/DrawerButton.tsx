import React from 'react';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';

import styles from '../../styles/buttonRippleStyle';

const DrawerButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.viewLeft_30}>
      <IconButton
        icon="menu"
        size={30}
        style={styles.icon_30}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    </View>
  );
};

export default DrawerButton;
