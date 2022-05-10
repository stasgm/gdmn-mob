import { StyleSheet, Text, View } from 'react-native';

export const MapViewScreen = () => {
  return (
    <View style={styles.container}>
      <Text>There will be a map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
