import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import MessagesScreen from "../../screens/MessagesScreen";

type MessagesStackParamList = {
  Messages: undefined;
};

const Stack = createStackNavigator<MessagesStackParamList>();

const MessagesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen key="Messages" name="Messages" component={MessagesScreen} />
    </Stack.Navigator>
  );
};

export default MessagesNavigator;
