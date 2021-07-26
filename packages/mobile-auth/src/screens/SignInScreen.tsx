import React, { useState } from 'react';
import { View, Keyboard } from 'react-native';

import { IUserCredentials } from '@lib/types';
import { useSelector } from '@lib/store';
import { AppInputScreen, globalStyles as styles, Input, PrimeButton, RoundButton, ScreenTitle } from '@lib/mobile-ui';
import api from '@lib/client-api';
// import { config } from '@lib/client-config';

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

  let initialCredentials: IUserCredentials = {
    name: '',
    password: '',
  };

  if (api.config.debug?.isMock) {
    // config.debug?.useMockup
    initialCredentials = {
      name: 'ГОЦЕЛЮК',
      password: '@123!',
    };
  }

  const [credential, setCredentials] = useState<IUserCredentials>(initialCredentials);

  const handleLogIn = () => {
    Keyboard.dismiss();
    onSignIn(credential);
  };

  return (
    <>
      <AppInputScreen>
        <ScreenTitle loadIcon={loading} errorText={error ? status : ''}>
          Вход пользователя
        </ScreenTitle>
        <Input
          label="Имя пользователя"
          value={credential.name}
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={(e) => setCredentials({ ...credential, name: e })}
        />
        <Input
          label="Пароль"
          secureText
          value={credential.password}
          onChangeText={(e) => setCredentials({ ...credential, password: e })}
        />
        <PrimeButton disabled={loading || !credential.name || !credential.password} icon="login" onPress={handleLogIn}>
          Войти
        </PrimeButton>
      </AppInputScreen>
      <View style={styles.buttons}>
        <RoundButton
          icon="server"
          onPress={() => {
            console.log('press');
            onDisconnect();
          }}
          disabled={loading}
        />
      </View>
    </>
  );
};

export default SignInScreen;
