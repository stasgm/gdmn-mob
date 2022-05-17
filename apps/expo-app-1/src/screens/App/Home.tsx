import { StyleSheet, Text, View } from 'react-native';
import { greeting } from '@libs/hello';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>{greeting()}</Text>
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
