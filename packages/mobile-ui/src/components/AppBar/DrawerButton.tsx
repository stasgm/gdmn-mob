import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

const DrawerButton = () => {
  const navigation = useNavigation();

  return <IconButton icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} size={30} />;
};

export default DrawerButton;
