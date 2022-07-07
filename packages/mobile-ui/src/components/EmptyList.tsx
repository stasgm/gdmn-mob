import React from 'react';
import { Text, StyleSheet } from 'react-native';

const EmptyList = () => <Text style={styles.empty}>Список пуст</Text>;

export { EmptyList };

const styles = StyleSheet.create({
  empty: {
    marginTop: 20,
    textAlign: 'center',
  },
});
