import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { globalStyles as styles, PrimeButton, RoundButton, AppScreen, ScreenTitle } from '@lib/mobile-ui';
import { IApiConfig } from '@lib/client-types';
import { useSelector } from '@lib/store';

import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../navigation/types';

import localStyles from './styles';

type Props = {
  settings: IApiConfig | undefined;
  onCheckDevice: () => void;
  onBreakConnection?: () => void;
};

const SplashScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const { onCheckDevice, onBreakConnection } = props;
  const { error, loading, status } = useSelector((state) => state.auth);

  return (
    <>
      <AppScreen>
        <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Подключение к серверу
        </ScreenTitle>
        <View style={localStyles.container}>
          <PrimeButton
            icon={!loading ? 'apps' : 'block-helper'}
            onPress={!loading ? onCheckDevice : onBreakConnection}
            disabled={loading}
          >
            {'Подключиться'}
          </PrimeButton>
        </View>
      </AppScreen>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={() => navigation.navigate('Config')} disabled={loading} />
      </View>
    </>
  );
};

export default SplashScreen;
