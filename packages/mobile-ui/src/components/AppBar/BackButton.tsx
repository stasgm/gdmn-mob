import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

interface IProps {
  onPress?: () => void;
}

const BackButton = (props: IProps) => {
  const navigation = useNavigation();

  return <IconButton icon="chevron-left" onPress={props.onPress || navigation.goBack} size={30} />;
};

export default BackButton;
