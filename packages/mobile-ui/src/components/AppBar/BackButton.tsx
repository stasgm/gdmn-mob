import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

const BackButton = () => {
  const navigation = useNavigation();

  return <IconButton icon="chevron-left" size={26} onPress={navigation.goBack} />;
};

export default BackButton;
