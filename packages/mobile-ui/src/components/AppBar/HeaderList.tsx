import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';

interface IHeaderListProps extends StackHeaderProps {
  menuAction?: () => void;
}

const HeaderList = ({ route, options, navigation, menuAction }: IHeaderListProps) => {
  const title = options.title ?? route.name;

  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <Appbar.Content title={title} />
      {menuAction && <Appbar.Action icon="dots-vertical" onPress={menuAction} />}
    </Appbar.Header>
  );
};

export default HeaderList;
