import { FontAwesome5 } from '@expo/vector-icons';
import { MenuButton, DrawerButton } from '@lib/mobile-ui/src/components/AppBar';

import useActionSheet from '@lib/mobile-ui/src/hooks/useActionSheet';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';

import Home from '../../screens/HomeScreen';
import TaskListScreen from '../../screens/TaskListScreen';

export type TabsStackParams = {
  Main: undefined;
  Tasks: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  const navigation = useNavigation();
  const showActionSheet = useActionSheet();

  const handleAddTask = () => {
    console.log('new Task');
  };

  const actionsMenu = useCallback(() => {
    showActionSheet([
      {
        title: 'Добавить задачу',
        onPress: handleAddTask,
      },
      {
        title: 'Отмена',
        type: 'cancel',
      },
    ]);
  }, [showActionSheet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <DrawerButton />,
      headerRight: () => <MenuButton actionsMenu={actionsMenu} />,
    });
  }, [actionsMenu, navigation]);

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
        component={TaskListScreen}
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
