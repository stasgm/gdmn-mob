import { IApiConfig } from '@lib/client-types';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { globalStyles } from '@lib/mobile-ui';
import { SubTitle } from '@lib/mobile-ui/src/components';

export type Props = {
  settings: IApiConfig | undefined;
  onSetSettings: (settings: IApiConfig) => void;
};

const ConfigScreen = (props: Props) => {
  const navigation = useNavigation();

  const { settings, onSetSettings } = props;
  const [serverName, setServerName] = useState(settings?.server || '');
  const [serverPort, setServerPort] = useState(settings?.port.toString() || '');
  const [timeout, setTimeout] = useState(settings?.timeout?.toString() || '');

  const { colors } = useTheme();

  const handleSaveSettings = () => {
    /*     const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || config.protocol;
    const server: string = match?.[2] || config.server; */

    const protocol: string = settings?.protocol || '';
    const server: string = serverName;

    const newSettings: IApiConfig = {
      apiPath: settings?.apiPath || '',
      protocol,
      port: parseInt(serverPort, 10),
      timeout: parseInt(timeout, 10),
      server,
    };

    onSetSettings(newSettings);

    navigation.navigate('Splash');
  };

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SubTitle>Настройка подключения</SubTitle>
      <TextInput
        value={serverName}
        onChangeText={setServerName}
        placeholder="Адрес сервера"
        style={[globalStyles.input, { backgroundColor: colors.background, color: colors.text }]}
      />
      <TextInput
        value={serverPort}
        onChangeText={setServerPort}
        placeholder="Порт"
        style={[globalStyles.input, { backgroundColor: colors.background, color: colors.text }]}
      />
      <TextInput
        value={timeout}
        onChangeText={setTimeout}
        placeholder="Варемя ожидания, м\с"
        style={[globalStyles.input, { backgroundColor: colors.background, color: colors.text }]}
      />
      <View style={localStyles.buttonsView}>
        <Button
          onPress={handleSaveSettings}
          icon="check"
          mode="contained"
          style={[globalStyles.rectangularButton, localStyles.button]}
        >
          Принять
        </Button>
        <Button
          onPress={navigation.goBack}
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
