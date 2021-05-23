import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';

interface IHeaderProps extends StackHeaderProps {
  rightButton?: {
    onPress: () => void;
  };
}

const Header = ({ scene, rightButton }: IHeaderProps) => {
  const { options, navigation } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <Appbar.Content title={title} />
      {rightButton && <Appbar.Action icon="dots-vertical" />}
    </Appbar.Header>
  );
};

export default Header;
