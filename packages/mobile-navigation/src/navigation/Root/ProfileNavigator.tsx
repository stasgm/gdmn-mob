import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ProfileScreen from '../../screens/ProfileScreen';

type ProfileStackParamList = {
  Profile: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: true }}>
      <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
