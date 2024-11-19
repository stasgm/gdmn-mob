import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { MD2Theme, useTheme } from 'react-native-paper';

const EmptyList = () => {
  const { colors } = useTheme<MD2Theme>();
  return <Text style={[{ color: colors.text }, styles.empty]}>Список пуст</Text>;
};

export { EmptyList };

const styles = StyleSheet.create({
  empty: {
    marginTop: 20,
    textAlign: 'center',
  },
});
