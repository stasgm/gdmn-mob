import React from 'react';

import { ActivityIndicator } from 'react-native-paper';

import { Centered } from './AppView';

export function AppLoader() {
  return (
    <Centered style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </Centered>
  );
}
