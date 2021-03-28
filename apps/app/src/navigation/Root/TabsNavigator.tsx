import { FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import Home from '../../screens/HomeScreen';

export type TabsStackParams = {
  Main: undefined;
  Tasks: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]} initialRouteName="Main">
      <TabsStack.Screen
        name="Main"
        component={Home}
        options={{
          title: 'Дела',
          tabBarLabel: 'Дела',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="copy" color={color} />,
        }}
      />
      <TabsStack.Screen
        name="Tasks"
        component={Home}
        options={{
          title: 'Задачи',
          tabBarLabel: 'Задачи',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="tasks" color={color} />,
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

export default TabsNavigator;
