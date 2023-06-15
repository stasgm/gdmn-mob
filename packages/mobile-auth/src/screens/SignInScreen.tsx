import localStyles from './styles';
import { GDMN_SECURITY_POLICY } from '../constants';
import React, { useCallback, useState } from 'react';
import { View, Keyboard, Linking } from 'react-native';

import { IUserCredentials } from '@lib/types';
import { useSelector } from '@lib/store';
import {
  AppInputScreen,
  globalStyles as styles,
  Input,
  MediumText,
  PrimeButton,
  RoundButton,
  ScreenTitle,
} from '@lib/mobile-ui';

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

  const [credential, setCredentials] = useState<IUserCredentials>({ name: '', password: '' });

  const [visiblePassword, setVisiblePassword] = useState(false);

  const handleLogIn = useCallback(() => {
    Keyboard.dismiss();
    onSignIn({ ...credential, name: credential.name.trim(), password: credential.password.trim() });
  }, [onSignIn, credential]);

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
          secureText={!visiblePassword}
          value={credential.password}
          onChangeText={(e) => setCredentials({ ...credential, password: e })}
          isIcon={true && credential.password !== ''}
          iconName={visiblePassword ? 'eye-outline' : 'eye-off-outline'}
          onIconPress={() => (visiblePassword ? setVisiblePassword(false) : setVisiblePassword(true))}
        />
        <View style={[styles.flexDirectionRow, styles.alignItemsCenter]}>
          <View style={[styles.directionColumn, localStyles.textWidth]}>
            <MediumText>
              {'Продолжая, Вы подтверждаете, что согласны с '}
              <MediumText
                onPress={() => Linking.openURL(GDMN_SECURITY_POLICY)}
                selectable={true}
                style={styles.textDecorationLine}
              >
                Политикой конфиденциальности
              </MediumText>
            </MediumText>
          </View>
        </View>
        <PrimeButton disabled={loading || !credential.name || !credential.password} icon="login" onPress={handleLogIn}>
          Войти
        </PrimeButton>
      </AppInputScreen>
      <View style={styles.buttons}>
        <RoundButton
          icon="server"
          onPress={() => {
            onDisconnect();
          }}
          disabled={loading}
        />
      </View>
    </>
  );
};

export default SignInScreen;
