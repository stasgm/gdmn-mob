import React from 'react';
import { View, StyleSheet } from 'react-native';

import { globalColors as colors } from '../..';

const ItemSeparator = () => {
  return <View style={[styles.separator, { backgroundColor: colors.primary }]} />;
};

export { ItemSeparator };

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
