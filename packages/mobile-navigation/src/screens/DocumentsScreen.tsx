import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DocumentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Документы приложения</Text>
    </View>
  );
};

export default DocumentsScreen;

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
