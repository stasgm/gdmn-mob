import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import RouteListScreen from '../../screens/Routes/RouteListScreen';

import { RoutesTabStackParamList } from './types';

const TabsStack = createMaterialBottomTabNavigator<RoutesTabStackParamList>();

const RoutsTabsNavigator = () => {
  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]}>
      <TabsStack.Screen
        name="RouteList"
        component={RouteListScreen}
        options={{
          title: 'Актуальные',
          tabBarLabel: 'Актуальные',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-document-outline" size={24} color={color} />,
        }}
      />
      <TabsStack.Screen
        name="RouteArchList"
        component={RouteListScreen}
        options={{
          title: 'Архив',
          tabBarLabel: 'Архив',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="archive-outline" size={24} color={color} />,
        }}
      />
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default RoutsTabsNavigator;
