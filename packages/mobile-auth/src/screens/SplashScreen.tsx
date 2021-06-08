import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { globalStyles as styles, PrimeButton, RoundButton, AppScreen, ScreenTitle } from '@lib/mobile-ui';
import { IApiConfig } from '@lib/client-types';
import { useSelector } from '@lib/store';

import localStyles from './styles';

type Props = {
  settings: IApiConfig | undefined;
  onCheckDevice: () => void;
  onBreakConnection?: () => void;
};

const SplashScreen = (props: Props) => {
  const navigation = useNavigation();

  const { onCheckDevice, onBreakConnection, settings } = props;
  const { error, loading, status } = useSelector((state) => state.auth);

  return (
    <>
      <AppScreen>
        <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Подключение к серверу
        </ScreenTitle>
        <View style={localStyles.container}>
          <Text style={localStyles.serverName}>
            {settings ? `${settings.protocol}${settings.server}:${settings.port}` : 'сервер не указан'}
          </Text>
          <PrimeButton icon={!loading ? 'apps' : 'block-helper'} onPress={!loading ? onCheckDevice : onBreakConnection}>
            {!loading ? 'Подключиться' : 'Прервать'}
          </PrimeButton>
        </View>
      </AppScreen>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={() => navigation.navigate('Config')} />
      </View>
    </>
  );
};

export default SplashScreen;
