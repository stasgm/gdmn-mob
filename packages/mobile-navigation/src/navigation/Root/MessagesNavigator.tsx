import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MessagesScreen from '../../screens/Messages/MessagesScreen';
import MessageViewScreen from '../../screens/Messages/MessageView';
import Header from '../Header';

type MessagesStackParamList = {
  Messages: undefined;
  MessageView: { id: string };
};

const Stack = createStackNavigator<MessagesStackParamList>();

const MessagesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
      screenOptions={{ headerShown: true, header: (props) => <Header {...props} /> }}
    >
      <Stack.Screen key="Messages" name="Messages" component={MessagesScreen} />
      <Stack.Screen key="MessageView" name="MessageView" component={MessageViewScreen} />
    </Stack.Navigator>
  );
};

export default MessagesNavigator;
