import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { InitialState, NavigationContainerRef, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
  Colors,
} from 'react-native-paper';

import { ConnectionScreen } from './src/screens/Auth/ConnectionScreen';
import { AuthStoreProvider, ServiceStoreProvider } from './src/store';

if (__DEV__) {
  import('./src/service/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const App = () => {
  const containerRef = React.useRef<NavigationContainerRef>();
  const [theme] = React.useState(DefaultTheme);

  const [initialState] = React.useState<InitialState | undefined>();

  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        primary: Colors.blue600,

        accent: theme.dark ? 'rgb(255, 55, 95)' : 'rgb(255, 45, 85)',
      },
    };
  }, [theme.colors, theme.dark]);

  return (
    <ActionSheetProvider>
      <ServiceStoreProvider>
        <AuthStoreProvider>
          <PaperProvider theme={paperTheme}>
            <StatusBar barStyle={!theme.dark ? 'dark-content' : 'light-content'} />
            <NavigationContainer
              ref={containerRef}
              initialState={initialState}
              theme={theme}
              /* onStateChange={state => {}} */
            >
              <ConnectionScreen />
            </NavigationContainer>
          </PaperProvider>
        </AuthStoreProvider>
      </ServiceStoreProvider>
    </ActionSheetProvider>
  );
};

export default App;
