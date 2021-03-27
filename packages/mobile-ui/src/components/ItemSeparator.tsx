import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.primary }]} />;
};

export { ItemSeparator };

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
