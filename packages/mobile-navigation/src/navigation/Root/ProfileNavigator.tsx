import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ProfileScreen from '../../screens/ProfileScreen';

import { ProfileStackParamList } from './types';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: true, title: 'Профиль' }}>
      <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
