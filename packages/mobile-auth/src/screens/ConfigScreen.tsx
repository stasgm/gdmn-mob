import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IApiConfig } from '@lib/client-types';
import { AppInputScreen, Input, PrimeButton, ScreenTitle } from '@lib/mobile-ui';

import localStyles from './styles';

export type Props = {
  settings: IApiConfig | undefined;
  onSetSettings: (settings: IApiConfig) => void;
};

const ConfigScreen = (props: Props) => {
  const navigation = useNavigation();

  const { settings, onSetSettings } = props;
  const [serverName, setServerName] = useState(`${settings?.protocol}${settings?.server}` || '');
  const [serverPort, setServerPort] = useState(settings?.port.toString() || '');
  const [timeout, setTimeout] = useState(settings?.timeout?.toString() || '');

  const handleSaveSettings = () => {
    const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || '';
    const server: string = match?.[2] || '';

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
    <AppInputScreen>
      <ScreenTitle infoRow={false}>Настройка подключения</ScreenTitle>
      <ScrollView>
        <Input label="Адрес сервера" value={serverName} onChangeText={setServerName} />
        <Input label="Порт" value={serverPort} onChangeText={setServerPort} />
        <Input label="Время ожидания, м\с" value={timeout} onChangeText={setTimeout} />
      </ScrollView>
      <View style={localStyles.buttonsView}>
        <PrimeButton
          icon="check"
          onPress={handleSaveSettings}
          style={localStyles.button}
          disabled={!serverName || !serverPort || !timeout}
        >
          Принять
        </PrimeButton>
        <PrimeButton icon="cancel" onPress={navigation.goBack} style={localStyles.button}>
          Отмена
        </PrimeButton>
      </View>
    </AppInputScreen>
  );
};

export default ConfigScreen;
