import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';

import { AppInputScreen, globalStyles as styles, Input, PrimeButton, RoundButton, ScreenTitle } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

type Props = {
  onDisconnect: () => void;
  onActivate: (code: string) => void;
};

const ActivationScreen = (props: Props) => {
  const { onDisconnect, onActivate } = props;

  const { error, loading, status } = useSelector((state) => state.auth);
  const [activationCode, setActivationCode] = useState('');

  const handleActivate = () => {
    Keyboard.dismiss();
    onActivate(activationCode);
  };

  return (
    <>
      <AppInputScreen>
        <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Активация устройства
        </ScreenTitle>
        <Input
          label="Введите код"
          value={activationCode}
          autoCorrect={false}
          keyboardType="number-pad"
          returnKeyType="done"
          onChangeText={setActivationCode}
        />
        <PrimeButton icon="login" onPress={handleActivate} disabled={loading || !activationCode}>
          Отправить
        </PrimeButton>
      </AppInputScreen>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={onDisconnect} />
      </View>
    </>
  );
};

export default ActivationScreen;
