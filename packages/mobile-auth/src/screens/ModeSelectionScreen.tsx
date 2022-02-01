import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { PrimeButton, AppScreen } from '@lib/mobile-ui';

import localStyles from './styles';

type Props = {
  onSetDemoMode: () => void;
  onSetServerMode: () => void;
};

const ModeSelectionScreen = (props: Props) => {
  const { onSetDemoMode, onSetServerMode } = props;

  return (
    <>
      <AppScreen>
        <View style={localStyles.container}>
          <PrimeButton icon={'presentation-play'} onPress={onSetDemoMode}>
            {'Демо режим'}
          </PrimeButton>
        </View>
        <TouchableOpacity onPress={onSetServerMode} style={localStyles.serverMode}>
          <Text style={localStyles.serverModeText}>Подключиться к серверу...</Text>
        </TouchableOpacity>
      </AppScreen>
    </>
  );
};

export default ModeSelectionScreen;
