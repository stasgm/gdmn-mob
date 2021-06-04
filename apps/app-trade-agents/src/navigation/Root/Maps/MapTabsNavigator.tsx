import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import { DrawerButton } from '@lib/mobile-ui';

import { useNavigation } from '@react-navigation/native';

import MapScreen from '../../../screens/Maps/MapsScreen';
import ListScreen from '../../../screens/Maps/ListScreen';

type MapTabsStackParams = {
  Maps: undefined;
  ListLocations: undefined;
};

const MapTabsStack = createMaterialBottomTabNavigator<MapTabsStackParams>();

const MapTabsNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      // headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [navigation]);

  return (
    <MapTabsStack.Navigator barStyle={[styles.tabBar]} initialRouteName="Maps">
      <MapTabsStack.Screen
        name="Maps"
        component={MapScreen}
        options={{
          title: 'Карта',
          tabBarLabel: 'Карта',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-outline" size={24} color={color} />,
        }}
      />
      <MapTabsStack.Screen
        name="ListLocations"
        component={ListScreen}
        options={{
          title: 'Список',
          tabBarLabel: 'Список',
          tabBarIcon: ({ color }) => <Entypo name="location" size={24} color={color} />,
        }}
      />
    </MapTabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default MapTabsNavigator;
