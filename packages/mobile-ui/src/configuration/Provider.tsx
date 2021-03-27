import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

interface AppProviderProps {
  theme: typeof DefaultTheme;
  children: React.ReactNode;
}

const AppProvider = ({ theme, children }: AppProviderProps) => {
  return (
    <ActionSheetProvider>
      <PaperProvider {...{ theme }}>{children}</PaperProvider>
    </ActionSheetProvider>
  );
};

export default AppProvider;
