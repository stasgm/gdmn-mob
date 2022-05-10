import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import TodoAddEdit from '../screens/TodoAddEdit';
import TodoList from '../screens/TodoList';
import { theme } from '../../../constants';

import { TodoStackParamList } from './types';

const Stack = createStackNavigator<TodoStackParamList>();

const TodoNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TodoList"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.secondary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen key="TodoList" name="TodoList" component={TodoList} options={{ title: 'Todo list' }} />
      <Stack.Screen key="TodoAddEdit" name="TodoAddEdit" component={TodoAddEdit} />
    </Stack.Navigator>
  );
};

export type TodoScreenNavigationProp = StackNavigationProp<TodoStackParamList>;

export default TodoNavigator;
