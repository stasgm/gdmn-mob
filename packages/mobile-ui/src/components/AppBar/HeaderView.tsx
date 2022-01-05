import React from 'react';
import { StackHeaderProps } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';

interface IHeaderViewProps extends StackHeaderProps {
  backAction?: () => void;
  menuAction?: () => void;
  scene: any;
}

const HeaderView = ({ scene, backAction, menuAction }: IHeaderViewProps) => {
  const { options, navigation } = scene.descriptor;
  const title = options.headerTitle ?? options.title ?? scene.route.name;

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={backAction?.() || navigation.goBack} />
      <Appbar.Content title={title} />
      {menuAction && <Appbar.Action icon="dots-vertical" onPress={menuAction} />}
    </Appbar.Header>
  );
};

export default HeaderView;
