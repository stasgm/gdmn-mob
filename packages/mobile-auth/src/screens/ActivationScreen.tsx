import React, { useState, useMemo } from 'react';
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { globalStyles as styles, Input, PrimeButton, RoundButton, SubTitle } from '@lib/mobile-ui';
import { useSelector } from '@lib/store';

import localStyles from './styles';

type Props = {
  onDisconnect: () => void;
  onActivate: (code: string) => void;
};

const ActivationScreen = (props: Props) => {
  const { onDisconnect, onActivate } = props;

  const { error, loading, status } = useSelector((state) => state.auth);
  const [activationCode, setActivationCode] = useState('');

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  const handleActivate = () => {
    Keyboard.dismiss();
    onActivate(activationCode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <SubTitle>Активация устройства</SubTitle>
            <Input
              label="Введите код"
              value={activationCode}
              autoCorrect={false}
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={setActivationCode}
            />
            <PrimeButton icon="login" onPress={handleActivate} disabled={request.isLoading || !activationCode}>
              Отправить
            </PrimeButton>
            <View style={localStyles.statusBox}>
              {request.isLoading && <ActivityIndicator size="small" color="#70667D" />}
              {request.isError && <Text style={localStyles.errorText}>Ошибка: {request.status}</Text>}
            </View>
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
