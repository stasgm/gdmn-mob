import React, { useState, useMemo } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';

import { IUserCredentials } from '@lib/types';
import { useSelector } from '@lib/store';
import { globalStyles as styles, Input, PrimeButton, RoundButton, SubTitle } from '@lib/mobile-ui';

import localStyles from './styles';

/*
  Порядок работы:
  1) Проверяем что пользователь активен
    1.1 Если активен переходим к пунтку 2
    1.2 Если не активен отображаем сообщение
  2) Осуществляем вход
    2.1) Вход удался -> вызываем actions.setUserStatus(true);
    2.2) Вход не удался -> отображаем сообщение об ошибке
*/

type Props = {
  onDisconnect: () => void;
  onSignIn: (credentials: IUserCredentials) => void;
};

const SignInScreen = (props: Props) => {
  const { onDisconnect, onSignIn } = props;

  const { error, loading, status } = useSelector((state) => state.auth);

  const request = useMemo(
    () => ({
      isError: error,
      isLoading: loading,
      status,
    }),
    [error, loading, status],
  );

  const [credential, setCredentials] = useState<IUserCredentials>({
    name: 'ГОЦЕЛЮК',
    password: '@123!',
  });

  const handleLogIn = () => {
    Keyboard.dismiss();
    onSignIn(credential);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <SubTitle>Вход пользователя</SubTitle>
            <Input
              label="Имя пользователя"
              value={credential.name}
              autoCorrect={false}
              onChangeText={(e) => setCredentials({ ...credential, name: e })}
            />
            <Input
              label="Пароль"
              secureText
              value={credential.password}
              onChangeText={(e) => setCredentials({ ...credential, password: e })}
            />
            <PrimeButton
              disabled={request.isLoading || !credential.name || !credential.password}
              icon="login"
              onPress={handleLogIn}
            >
              Войти
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
/*
const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    margin: 10,
  },
  contentWidthKbd: {
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  statusBox: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
}); */

export default SignInScreen;
