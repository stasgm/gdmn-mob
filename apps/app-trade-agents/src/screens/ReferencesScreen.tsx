import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ReferencesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Справочники приложения</Text>
    </View>
  );
};

export default ReferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
