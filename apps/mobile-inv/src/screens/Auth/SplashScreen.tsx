import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import styles from '../../styles/global';

type Props = {
  deviceRegistered?: boolean;
  serverName?: string;
  isLoading?: boolean;
  isError?: boolean;
  status?: string;
  connection?: () => void;
  breakConnection?: () => void;
  showSettings?: () => void;
};

const SplashScreen = (props: Props) => {
  const { serverName, isLoading, isError, status, connection, breakConnection, showSettings } = props;
  const { colors } = useTheme();

  return (
    <>
      <View style={{ ...styles.container, ...localStyles.container }}>
        <SubTitle>Подключение к серверу</SubTitle>
        <Text style={localStyles.serverName}>{serverName}</Text>
        <View
          style={{
            ...localStyles.statusBox,
            backgroundColor: colors.background,
          }}
        >
          {isError && <Text style={localStyles.errorText}>Ошибка: {status}</Text>}
          {isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        {!isLoading ? (
          <Button
            onPress={connection}
            icon="apps"
            mode="contained"
            style={[styles.rectangularButton, localStyles.buttons]}
          >
            Подключиться
          </Button>
        ) : (
          <Button
            onPress={breakConnection}
            icon="block-helper"
            mode="contained"
            style={[styles.rectangularButton, localStyles.buttons]}
          >
            Прервать
          </Button>
        )}
      </View>
      <View style={styles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={showSettings}
          style={{
            ...styles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
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
