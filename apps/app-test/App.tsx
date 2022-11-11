import React /*, { useCallback, useEffect, useMemo, useState }*/ from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MediumText } from '@lib/mobile-ui';

// import { Provider } from 'react-redux';

// import { ActivityIndicator, Caption, useTheme } from 'react-native-paper';

// import {
//   /*globalStyles as styles, */ Theme as defaultTheme,
//   Provider as UIProvider /*, AppScreen*/,
// } from '@lib/mobile-ui';
// import { NavigationContainer } from '@react-navigation/native';

// import { store } from './src/store';

// import ApplNavigator from './src/navigation/Root/ApplNavigator';
// import { store } from './src/store';

// import { messageRequest, ONE_SECOND_IN_MS } from './src/utils/constants';

export default function App() {
  return (
    <View style={styles.container}>
      <MediumText>Open up App.js to start working on your app!</MediumText>
      <StatusBar style="auto" />
    </View>
  );
  //   // return (
  //   // <Provider store={store}>
  //   //   <UIProvider theme={defaultTheme}>
  //   //     <NavigationContainer>{/* <DrawerNavigator /> */}</NavigationContainer>
  //   //   </UIProvider>
  //   // </Provider>
  //   // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
