import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import { ConfigScreen } from '../screens/Auth/ConfigScreen';
import { ActivationScreen } from '../screens/Auth/ActivationScreen';
import { SignInScreen } from '../screens/Auth/SignInScreen';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { useAuth } from '../context/auth';

export type AuthStackParamList = {
  Connection: undefined;
  Splash: undefined;
  Login: undefined;
  Config: undefined;
  Activation: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

console.log('AuthNavigator');

const AuthNavigator = () => {
  const {
    device,
    settingsForm,
    settings,
    showSettings,
    setSettings,
    checkDevice,
    loading: { serverReq },
  } = useAuth();

  const CongfigWithParams = useCallback(
    () => <ConfigScreen setSettings={setSettings} showSettings={showSettings} settings={settings} />,
    [setSettings, settings, showSettings],
  );

  const SplashWithParams = useCallback(
    () => (
      <SplashScreen serverReq={serverReq} showSettings={showSettings} settings={settings} checkDevice={checkDevice} />
    ),
    [checkDevice, serverReq, settings, showSettings],
  );

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {device ? (
        <AuthStack.Screen name="Login" component={SignInScreen} />
      ) : settingsForm ? (
        <AuthStack.Screen name="Config" component={CongfigWithParams} />
      ) : device === undefined ? (
        <AuthStack.Screen name="Splash" component={SplashWithParams} options={{ animationTypeForReplace: 'pop' }} />
      ) : (
        <AuthStack.Screen name="Activation" component={ActivationScreen} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
