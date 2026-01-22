import { ProfileStackParamList } from './types';
import ProfileScreen from '../../screens/ProfileScreen';
import ProfileDetailsScreen from '../../screens/ProfileDetailsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: true, title: 'Профиль' }}>
      <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} />
      <Stack.Screen
        key="SettingsDetails"
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Настройки пользователя' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
