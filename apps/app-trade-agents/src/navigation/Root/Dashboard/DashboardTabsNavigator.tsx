import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { MenuButton, useActionSheet } from '@lib/mobile-ui';

import Home from '../../../screens/Dashboard/HomeScreen';
import TaskListScreen from '../../../screens/Dashboard/TaskListScreen';
import { navBackDrawer } from '../../../components/navigateOptions';

export type TabsStackParams = {
  Main: undefined;
  Tasks: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();
const tabHome = ({ color }: any) => <FontAwesome5 size={20} name="copy" color={color} />;
const tabTasks = ({ color }: any) => <FontAwesome5 size={20} name="tasks" color={color} />;

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

  const renderRight = useCallback(() => <MenuButton actionsMenu={actionsMenu} />, [actionsMenu]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: navBackDrawer,
      headerRight: renderRight,
    });
  }, [navigation, renderRight]);

  return (
    <TabsStack.Navigator barStyle={[styles.tabBar]} initialRouteName="Main">
      <TabsStack.Screen
        name="Main"
        component={Home}
        options={{
          title: 'Дела',
          tabBarLabel: 'Дела',
          tabBarIcon: tabHome,
        }}
      />
      <TabsStack.Screen
        name="Tasks"
        component={TaskListScreen}
        options={{
          title: 'Задачи',
          tabBarLabel: 'Задачи',
          tabBarIcon: tabTasks,
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
