import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MessageListScreen from '../../screens/Messages/MessagesListScreen';
import MessageViewScreen from '../../screens/Messages/MessageViewScreen';

import { MessagesStackParamList } from './types';

const Stack = createStackNavigator<MessagesStackParamList>();

const MessagesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MessageList" screenOptions={{ headerShown: true }}>
      <Stack.Screen
        key="MessageList"
        name="MessageList"
        component={MessageListScreen}
        options={{ title: 'Сообщения' }}
      />
      <Stack.Screen
        key="MessageView"
        name="MessageView"
        component={MessageViewScreen}
        options={{ title: 'Сообщение' }}
      />
    </Stack.Navigator>
  );
};

export default MessagesNavigator;
