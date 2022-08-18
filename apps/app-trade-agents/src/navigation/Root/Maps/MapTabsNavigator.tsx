import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { navBackDrawer } from '@lib/mobile-ui';

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
      headerLeft: navBackDrawer,
    });
  }, [navigation]);

  const tabMap = ({ color }: any) => <MaterialCommunityIcons name="map-outline" size={24} color={color} />;
  const tabList = ({ color }: any) => <Entypo name="location" size={24} color={color} />;

  return (
    <BottomSheetModalProvider>
      <MapTabsStack.Navigator barStyle={[styles.tabBar]} initialRouteName="Maps">
        <MapTabsStack.Screen
          name="Maps"
          component={MapScreen}
          options={{
            title: 'Карта',
            tabBarLabel: 'Карта',
            tabBarIcon: tabMap,
          }}
        />
        <MapTabsStack.Screen
          name="ListLocations"
          component={ListScreen}
          options={{
            title: 'Список',
            tabBarLabel: 'Список',
            tabBarIcon: tabList,
          }}
        />
      </MapTabsStack.Navigator>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default MapTabsNavigator;
