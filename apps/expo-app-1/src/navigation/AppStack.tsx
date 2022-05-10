// import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
// import { useNavigation, DrawerActions } from '@react-navigation/native';

import { HomeScreen } from '../screens/App/Home';

// import { styles } from '../styles';

import { AppStackParamList } from './types';

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  // const navigation = useNavigation();

  // const openDrawer = () => {
  //   navigation.dispatch(DrawerActions.openDrawer());
  // };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        // headerLeft: () => (
        //   <MaterialIcons name="menu" size={30} style={styles.menuButton} onPress={openDrawer}/>
        // ),
      }}
    >
      <Stack.Screen key="Home" name="Home" component={HomeScreen} options={{ title: 'Home' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
