import * as React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface AppProviderProps {
  theme: any;
  children: React.ReactNode;
}

const AppProvider = ({ theme, children }: AppProviderProps) => {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <PaperProvider theme={theme}>
          <>
            {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
            {children}
          </>
        </PaperProvider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
