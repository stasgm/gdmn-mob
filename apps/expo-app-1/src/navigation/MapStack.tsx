import { createStackNavigator } from '@react-navigation/stack';

import { MapViewScreen } from '../screens/Map/MapView';

import { MapStackParamList } from './types';

const Stack = createStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MapView" screenOptions={{ headerShown: false }}>
      <Stack.Screen key="MapView" name="MapView" component={MapViewScreen} />
    </Stack.Navigator>
  );
};

export default MapNavigator;
