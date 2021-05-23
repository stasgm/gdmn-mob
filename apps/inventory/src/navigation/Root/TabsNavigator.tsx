import { FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

import Home from '../../screens/HomeScreen';

export type TabsStackParams = {
  Main: undefined;
  Tasks: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <IconButton icon="menu" size={26} onPress={() => console.log('nav')} />,
      headerRight: () => <IconButton icon="menu" size={28} onPress={() => console.log('click')} />,
    });
  }, [navigation]);

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
