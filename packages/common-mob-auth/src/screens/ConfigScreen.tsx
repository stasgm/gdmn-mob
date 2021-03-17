import { IApiConfig } from '@lib/common-client-types';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Text, Button } from 'react-native-paper';

import { globalStyles } from '@lib/common-ui';

export type Props = {
  settings: IApiConfig | undefined;
  setSettings: (settings: IApiConfig) => void;
  showSettings: (visible: boolean) => void;
};

const ConfigScreen = (props: Props) => {
  const { settings, setSettings, showSettings } = props;
  const [serverName, setServerName] = useState(settings?.server || '');
  const [serverPort, setServerPort] = useState(settings?.port.toString() || '');
  const [timeout, setTimeout] = useState(settings?.timeout?.toString() || '');

  const { colors } = useTheme();

  const saveSettings = () => {
    /*     const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || config.protocol;
    const server: string = match?.[2] || config.server; */

    const protocol: string = settings?.protocol || '';
    const server: string = serverName;

    const url: IApiConfig = {
      apiPath: settings?.apiPath || '',
      protocol,
      port: parseInt(serverPort, 10),
      timeout: parseInt(timeout, 10),
      server,
    };

    setSettings(url);
  };

  const hideSettings = () => {
    showSettings(false);
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={globalStyles.title}>Настройка подключения</Text>
      <TextInput
        value={serverName}
        onChangeText={setServerName}
        placeholder="Адрес сервера"
        style={[
          globalStyles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        value={serverPort}
        onChangeText={setServerPort}
        placeholder="Порт"
        style={[
          globalStyles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        value={timeout}
        onChangeText={setTimeout}
        placeholder="Варемя ожидания, м\с"
        style={[
          globalStyles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <View style={localStyles.buttonsView}>
        <Button
          onPress={saveSettings}
          icon="check"
          mode="contained"
          style={[globalStyles.rectangularButton, localStyles.button]}
        >
          Принять
        </Button>
        <Button
          onPress={hideSettings}
          icon="cancel"
          mode="contained"
          style={[globalStyles.rectangularButton, localStyles.button]}
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
