import { useTheme } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { IBaseUrl } from '../../../../common';
import SubTitle from '../../components/SubTitle';
import config from '../../config';
import styles from '../../styles/global';

type Props = {
  serverName?: string;
  serverPort?: number;
  timeout?: number;
  hideSettings: () => void;
  changeSettings: (baseUrl: IBaseUrl) => void;
};

const ConfigScreen = (props: Props) => {
  const { serverName, serverPort, hideSettings, changeSettings, timeout } = props;
  const [newServerName, setNewServerName] = useState(serverName);
  const [newServerPort, setNewServerPort] = useState(serverPort?.toString());
  const [newTimeout, setNewTimeout] = useState(timeout?.toString());
  const { colors } = useTheme();

  const setSettings = useCallback(() => {
    const match = newServerName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol = match[1];
    const server = match[2];

    const url: IBaseUrl = {
      apiPath: config.apiPath,
      protocol,
      port: parseInt(newServerPort, 10),
      timeout: parseInt(newTimeout, 10),
      server,
    };

    changeSettings(url);
  }, [changeSettings, newServerName, newServerPort, newTimeout]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SubTitle>Настройка подключения</SubTitle>
      <TextInput
        value={newServerName}
        onChangeText={setNewServerName}
        placeholder="Адрес сервера"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={newServerPort}
        onChangeText={setNewServerPort}
        placeholder="Порт"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={newTimeout}
        onChangeText={setNewTimeout}
        placeholder="Варемя ожидания, м\с"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <View style={localStyles.buttonsView}>
        <Button
          onPress={setSettings}
          icon="check"
          mode="contained"
          style={[styles.rectangularButton, localStyles.button]}
        >
          Принять
        </Button>
        <Button
          onPress={hideSettings}
          icon="cancel"
          mode="contained"
          style={[styles.rectangularButton, localStyles.button]}
        >
          Отмена
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export { ConfigScreen };
