import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ProfileScreen from '../../screens/ProfileScreen';
import Header from '../Header';

type ProfileStackParamList = {
  Profile: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: true, header: (props) => <Header {...props} /> }}
    >
      <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
