import React, { useState, useEffect, useMemo } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, TextInput, IconButton, Button, ActivityIndicator, useTheme } from 'react-native-paper';

import { IUserCredentials } from '@lib/types';

// import { useAuth } from '../context/auth';
import { globalStyles } from '@lib/mobile-ui';
import { SubTitle } from '@lib/mobile-ui/src/components';
import { useSelector } from '@lib/store';

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
  const { colors } = useTheme(); // TODO Вынести в ui

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
    name: 'Stas',
    password: '@123!',
  });

  console.log('signIn');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    console.log('mount signin');
    return () => {
      console.log('unmount signin');
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogIn = () => {
    Keyboard.dismiss();
    onSignIn(credential);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={[globalStyles.container, isKeyboardVisible && style.contentWidthKbd]}>
          <View>
            <SubTitle>Вход пользователя</SubTitle>
            <TextInput
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Имя пользователя"
              value={credential.name}
              onChangeText={(val) => setCredentials({ ...credential, name: val })}
              style={[globalStyles.input, { backgroundColor: colors.surface, color: colors.text }]}
            />
            <TextInput
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Пароль"
              secureTextEntry
              value={credential.password}
              onChangeText={(val) => setCredentials({ ...credential, password: val })}
              style={[globalStyles.input, { backgroundColor: colors.surface, color: colors.text }]}
            />
            <Button
              mode="contained"
              disabled={request.isLoading}
              icon="login"
              onPress={handleLogIn}
              style={globalStyles.rectangularButton}
            >
              Войти
            </Button>
          </View>
          <View style={style.statusBox}>
            {request.isError && <Text style={style.errorText}>Ошибка: {request.status}</Text>}
            {request.isLoading && <ActivityIndicator size="large" color="#70667D" />}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={onDisconnect}
          style={{
            ...globalStyles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const style = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
    alignItems: 'center',
    // height: 100,
    // flex: 1,
  },
  title: {
    textAlign: 'center',
  },
});

export { SignInScreen };
