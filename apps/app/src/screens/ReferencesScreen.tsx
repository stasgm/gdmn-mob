import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ReferencesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>References</Text>
    </View>
  );
};

export default ReferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
