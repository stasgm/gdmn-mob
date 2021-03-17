import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import Home from '../../screens/HomeScreen';

export type TabsStackParams = {
  Main: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]} initialRouteName="Main">
      <TabsStack.Screen
        name="Main"
        component={Home}
        options={{
          title: 'Главное',
          tabBarLabel: 'Главное',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="home-circle-outline" color={color} />,
        }}
      />
      {/*       <TabsStack.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          title: 'Справочники',
          tabBarLabel: 'Справочники',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="book-multiple-outline" color={color} />,
        }}
      />
      <TabsStack.Screen
        name="Sync"
        component={Settings}
        options={{
          title: 'Обмен',
          tabBarLabel: 'Обмен',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="sync" color={color} />,
        }}
      /> */}
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
