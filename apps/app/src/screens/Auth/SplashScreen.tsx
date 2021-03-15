import { IApiConfig, IDataFetch } from '@lib/common-client-types';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
// import { useAuth } from '../../context/auth';
import globalStyles from '../../styles/global';

type Props = {
  settings: IApiConfig | undefined;
  serverReq: IDataFetch;
  checkDevice?: () => void;
  breakConnection?: () => void;
  showSettings: (visible: boolean) => void;
};

const SplashScreen = (props: Props) => {
  const { checkDevice, breakConnection, serverReq, settings, showSettings } = props;

  const { colors } = useTheme();

  return (
    <>
      <View style={[globalStyles.container, localStyles.container]}>
        <SubTitle>Подключение к серверу</SubTitle>
        <Text style={localStyles.serverName}>
          {settings ? `${settings.protocol}${settings.server}:${settings.port}` : 'сервер не указан'}
        </Text>
        <View
          style={{
            ...localStyles.statusBox,
            backgroundColor: colors.background,
          }}
        >
          {serverReq.isError && <Text style={localStyles.errorText}>Ошибка: {serverReq.status}</Text>}
          {serverReq.isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        {!serverReq.isLoading ? (
          <Button
            onPress={checkDevice}
            icon="apps"
            mode="contained"
            style={[globalStyles.rectangularButton, localStyles.buttons]}
          >
            Подключиться
          </Button>
        ) : (
          <Button
            onPress={breakConnection}
            icon="block-helper"
            mode="contained"
            style={[globalStyles.rectangularButton, localStyles.buttons]}
          >
            Прервать
          </Button>
        )}
      </View>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => showSettings(true)}
          color={colors.background}
          style={[globalStyles.circularButton, { backgroundColor: colors.primary }]}
        />
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  serverName: {
    color: '#888',
    fontSize: 18,
    marginBottom: 10,
  },
  statusBox: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
});

export { SplashScreen };
