import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SettingsSceen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки приложения</Text>
    </View>
  );
};

export default SettingsSceen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
