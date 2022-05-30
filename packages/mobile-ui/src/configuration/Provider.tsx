import * as React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

interface AppProviderProps {
  theme: any;
  children: React.ReactNode;
}

const AppProvider = ({ theme, children }: AppProviderProps) => {
  return (
    <ActionSheetProvider>
      <PaperProvider theme={theme}>
        <>
          {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
          {children}
        </>
      </PaperProvider>
    </ActionSheetProvider>
  );
};

export default AppProvider;
