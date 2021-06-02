import React, { useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DrawerButton } from '@lib/mobile-ui';

import { useNavigation } from '@react-navigation/native';

import MapScreen from '../../screens/Maps';

import { MapStackParamList } from './types';

const Stack = createStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      // headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  return (
    <Stack.Navigator initialRouteName="MapGeoView" screenOptions={{ headerShown: true, title: 'Карта' }}>
      <Stack.Screen name="MapGeoView" component={MapScreen} options={{ title: 'Карта' }} />
      <Stack.Screen name="ListGeoView" component={MapScreen} options={{ title: 'Список' }} />
    </Stack.Navigator>
  );
};
export default MapNavigator;
