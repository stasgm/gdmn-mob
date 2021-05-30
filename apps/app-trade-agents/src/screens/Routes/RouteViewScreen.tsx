// import { SubTitle } from '@lib/mobile-ui/src/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { RoutesStackParamList } from '../../navigation/Root/types';

const RouteViewScreen = () => {
  const id = useRoute<RouteProp<RoutesStackParamList, 'RouteView'>>().params?.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Просмотр маршурута</Text>
    </View>
  );
};

export default RouteViewScreen;

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
