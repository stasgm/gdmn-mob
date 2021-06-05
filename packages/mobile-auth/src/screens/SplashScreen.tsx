import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { globalStyles as styles, PrimeButton, RoundButton, SubTitle } from '@lib/mobile-ui';
import { IApiConfig } from '@lib/client-types';
import { useSelector } from '@lib/store';

import localStyles from './styles';

type Props = {
  settings: IApiConfig | undefined;
  onCheckDevice: () => void;
  onBreakConnection?: () => void;
};

const SplashScreen = (props: Props) => {
  const { onCheckDevice, onBreakConnection, settings } = props;
  const navigation = useNavigation();

  const { error, loading, status } = useSelector((state) => state.auth);

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  return (
    <>
      <View style={[styles.container, localStyles.container]}>
        <SubTitle>Подключение к серверу</SubTitle>
        <Text style={localStyles.serverName}>
          {settings ? `${settings.protocol}${settings.server}:${settings.port}` : 'сервер не указан'}
        </Text>
        <View style={localStyles.statusBox}>
          {request.isError && <Text style={localStyles.errorText}>Ошибка: {request.status}</Text>}
          {request.isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        <PrimeButton
          icon={!request.isLoading ? 'apps' : 'block-helper'}
          onPress={!request.isLoading ? onCheckDevice : onBreakConnection}
        >
          {!request.isLoading ? 'Подключиться' : 'Прервать'}
        </PrimeButton>
      </View>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={() => navigation.navigate('Config')} />
      </View>
    </>
  );
};

export default SplashScreen;
