import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IApiConfig } from '@lib/client-types';
import { AppInputScreen, Input, PrimeButton, ScreenTitle } from '@lib/mobile-ui';

import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../navigation/types';

import localStyles from './styles';

export type Props = {
  settings: IApiConfig | undefined;
  onSetSettings: (settings: IApiConfig) => void;
  onSetDemoMode: () => void;
};

const ConfigScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Config'>>();

  const { settings, onSetSettings, onSetDemoMode } = props;
  const [serverName, setServerName] = useState(`${settings?.protocol}${settings?.server}` || '');
  const [serverPort, setServerPort] = useState(settings?.port?.toString() || '');
  const [timeout] = useState(settings?.timeout?.toString() || '');
  const [deviceId, setDeviceId] = useState(settings?.deviceId || '');

  const handleSaveConfig = () => {
    const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || '';
    const server: string = match?.[2] || '';

    const newSettings: IApiConfig = {
      apiPath: settings?.apiPath || '',
      protocol,
      port: parseInt(serverPort, 10),
      timeout: parseInt(timeout, 10),
      server,
      deviceId,
    };

    onSetSettings(newSettings);

    navigation.navigate('Splash');
  };

  return (
    <AppInputScreen>
      <ScreenTitle infoRow={false}>Настройка подключения</ScreenTitle>
      <Input label="Адрес сервера" value={serverName} onChangeText={setServerName} clearInput={true} />
      <Input label="Порт" value={serverPort} onChangeText={setServerPort} clearInput={true} />
      {/* <Input label="Время ожидания, м\с" value={timeout} onChangeText={setTimeout} /> */}
      <Input label="ID устройства" value={deviceId} onChangeText={setDeviceId} clearInput={true} />
      <View style={localStyles.buttonsView}>
        <PrimeButton
          icon="check"
          onPress={handleSaveConfig}
          style={localStyles.button}
          disabled={!serverName || !serverPort || !timeout}
        >
          Сохранить
        </PrimeButton>
        <PrimeButton icon="cancel" onPress={() => navigation.navigate('Splash')} style={localStyles.button}>
          Отмена
        </PrimeButton>
      </View>
      <View style={localStyles.buttonsView}>
        <PrimeButton outlined icon="presentation-play" onPress={onSetDemoMode} style={localStyles.button}>
          Подключиться в демо режиме
        </PrimeButton>
      </View>
    </AppInputScreen>
  );
};

export default ConfigScreen;
