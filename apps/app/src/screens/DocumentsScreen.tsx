import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DocumentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Documents</Text>
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
