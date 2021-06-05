import React, { useState, useMemo } from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Text, TextInput, IconButton, Button, useTheme } from 'react-native-paper';

import { IUserCredentials } from '@lib/types';

// import { useAuth } from '../context/auth';
import { globalStyles as styles } from '@lib/mobile-ui';
import { Input, PrimeButton, RoundButton, SubTitle } from '@lib/mobile-ui/src/components';
import { useSelector } from '@lib/store';

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
  // request: IDataFetch;
  onDisconnect: () => void;
  onSignIn: (credentials: IUserCredentials) => void;
};

const SignInScreen = (props: Props) => {
  const { onDisconnect, onSignIn } = props;
  // const { colors } = useTheme(); // TODO Вынести в ui

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, localStyles.container]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={localStyles.inner}>
            <View style={styles.subHeader}>
              <SubTitle>Вход пользователя</SubTitle>
            </View>
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
            {/*   <TextInput
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Имя пользователя"
              value={credential.name}
              onChangeText={(val) => setCredentials({ ...credential, name: val })}
              style={[loca.input, { backgroundColor: colors.surface, color: colors.text }]}
            />
            <TextInput
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Пароль"
              secureTextEntry
              value={credential.password}
              onChangeText={(val) => setCredentials({ ...credential, password: val })}
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            /> */}
            {/*             <Button
              mode="contained"
              disabled={request.isLoading}
              icon="login"
              loading={request.isLoading}
              onPress={handleLogIn}
              style={styles.rectangularButton}
            >
              Войти
            </Button> */}
            <PrimeButton disabled={request.isLoading} icon="login" onPress={handleLogIn}>
              Войти
            </PrimeButton>
            {request.isError && (
              <View style={localStyles.statusBox}>
                {<Text style={localStyles.errorText}>Ошибка: {request.status}</Text>}
              </View>
            )}
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
