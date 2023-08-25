import localStyles from './styles';
import React from 'react';
import { View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';

import { PrimeButton, AppScreen } from '@lib/mobile-ui';

type Props = {
  onSetDemoMode: () => void;
  onSetServerMode: () => void;
};

const ModeSelectionScreen = (props: Props) => {
  const { onSetDemoMode, onSetServerMode } = props;
  const windowWidth = useWindowDimensions().width;

  return (
    <>
      <AppScreen>
        <View style={localStyles.container}>
          <PrimeButton icon={'presentation-play'} onPress={onSetDemoMode}>
            Начать работу
          </PrimeButton>
        </View>
        <TouchableOpacity onPress={onSetServerMode} style={localStyles.serverMode}>
          <Text style={localStyles.serverModeText}>{`Подключиться к серверу ${
            windowWidth > 320 ? 'компании' : ''
          } »`}</Text>
        </TouchableOpacity>
      </AppScreen>
    </>
  );
};

export default ModeSelectionScreen;
