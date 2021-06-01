import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

import colors from '../../styles/colors';

const BackButton = () => {
  const navigation = useNavigation();

  return <IconButton color={colors.black} icon="chevron-left" size={26} onPress={navigation.goBack} />;
};

export default BackButton;
