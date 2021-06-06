import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, SafeAreaView } from 'react-native';

import { globalStyles as styles, Input, PrimeButton, RoundButton, SubTitle } from '@lib/mobile-ui';
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <SubTitle loadIcon={loading} errorText={error ? status : ''}>
              Активация устройства
            </SubTitle>
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.buttons}>
        <RoundButton icon="server" onPress={onDisconnect} />
      </View>
    </SafeAreaView>
  );
};

export default ActivationScreen;
