import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { PrimeButton, AppScreen, ScreenTitle } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import localStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';

type Props = {
  onSetDemoMode: () => void;
  onSetServerMode: () => void;
};

const ModeSelectionScreen = (props: Props) => {
  // const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Mode'>>();

  const { onSetDemoMode, onSetServerMode } = props;
  const { error, loading, status } = useSelector((state) => state.auth);

  // const handleSetServerMode = () => {
  //   onSetServerMode();
  //   //navigation.navigate('Config');
  //   navigation.navigate('Config');
  // }

  return (
    <>
      <AppScreen>
        {/* <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Подключиться в демо режиме
        </ScreenTitle> */}
        <View style={localStyles.container}>
          <PrimeButton icon={'presentation-play'} onPress={onSetDemoMode}>
            {'Подключиться в демо режиме'}
          </PrimeButton>
          {/* <PrimeButton icon={'apps'} onPress={onSetServerMode}>
            {'Пропустить'}
          </PrimeButton> */}
        </View>
        <TouchableOpacity onPress={onSetServerMode} style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <Text style={{ fontSize: 16 }}>Подключиться к серверу...</Text>
        </TouchableOpacity>
      </AppScreen>
    </>
  );
};

export default ModeSelectionScreen;
