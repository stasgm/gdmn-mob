import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

const DrawerButton = () => {
  const navigation = useNavigation();

  return <IconButton icon="menu" size={26} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />;
};

export default DrawerButton;
