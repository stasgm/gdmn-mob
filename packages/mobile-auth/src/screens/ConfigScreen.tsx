import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IApiConfig } from '@lib/client-types';
import { AppScreen, Input, PrimeButton, ScreenTitle } from '@lib/mobile-ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../navigation/types';

import localStyles from './styles';

export type Props = {
  config: IApiConfig | undefined;
  onSetConfig: (config: IApiConfig) => void;
  onSetDemoMode: () => void;
};

const ConfigScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Config'>>();

  const { config, onSetConfig, onSetDemoMode } = props;
  const [serverName, setServerName] = useState(`${config?.protocol}${config?.server}` || '');
  const [serverPort, setServerPort] = useState(config?.port?.toString() || '');
  const [timeout] = useState(config?.timeout?.toString() || '');
  const [deviceId, setDeviceId] = useState(config?.deviceId || '');

  const handleSaveConfig = () => {
    const match = serverName.match(/^(.*:\/\/)([A-Za-z0-9\-.]+)/);
    const protocol: string = match?.[1] || '';
    const server: string = match?.[2] || '';

    const newConfig: IApiConfig = {
      apiPath: config?.apiPath || '',
      protocol,
      port: parseInt(serverPort, 10),
      timeout: parseInt(timeout, 10),
      server,
      deviceId,
    };

    onSetConfig(newConfig);

    navigation.navigate('Splash');
  };

  const handleCancel = () => {
    config && onSetConfig({ ...config });
    navigation.navigate('Splash');
  };

  return (
    <AppScreen style={configStyles.screen}>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} style={configStyles.keybord}>
        <ScreenTitle infoRow={false}>Настройка подключения</ScreenTitle>
        <Input label="Адрес сервера" value={serverName} onChangeText={setServerName} clearInput={true} />
        <Input label="Порт" value={serverPort} onChangeText={setServerPort} clearInput={true} />
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
          <PrimeButton icon="cancel" onPress={handleCancel} style={localStyles.button}>
            Отмена
          </PrimeButton>
        </View>
        <View style={localStyles.buttonsView}>
          <PrimeButton outlined icon="presentation-play" onPress={onSetDemoMode} style={localStyles.button}>
            Демо режим
          </PrimeButton>
        </View>
      </KeyboardAwareScrollView>
    </AppScreen>
  );
};

export default ConfigScreen;

const configStyles = StyleSheet.create({
  screen: { alignItems: 'center', flexDirection: 'row', flex: 1 },
  keybord: { paddingVertical: 20, flexDirection: 'column' },
});
