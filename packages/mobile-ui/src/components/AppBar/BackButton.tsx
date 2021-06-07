import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

const BackButton = () => {
  const navigation = useNavigation();

  return <IconButton icon="chevron-left" onPress={navigation.goBack} size={30} />;
};

export default BackButton;
