import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import styles from '../styles/global';

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

export default ItemSeparator;
