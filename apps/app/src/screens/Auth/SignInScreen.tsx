import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, TextInput, IconButton, Button, ActivityIndicator, useTheme } from 'react-native-paper';

import { IUserCredentials } from '@lib/common-types';

import { useAuth } from '../../context/auth';

import globalStyles from '../../styles/global';
import SubTitle from '../../components/SubTitle';

/*
  Порядок работы:
  1) Проверяем что пользователь активен
    1.1 Если активен переходим к пунтку 2
    1.2 Если не активен отображаем сообщение
  2) Осуществляем вход
    2.1) Вход удался -> вызываем actions.setUserStatus(true);
    2.2) Вход не удался -> отображаем сообщение об ошибке
*/
const SignInScreen = () => {
  const { colors } = useTheme();

  const {
    signIn,
    disconnect,
    loading: { serverReq },
  } = useAuth();

  const [credential, setCredentials] = useState<IUserCredentials>({
    userName: '',
    password: '',
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const logIn = async () => {
    Keyboard.dismiss();
    await signIn(credential);
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
              value={credential.userName}
              onChangeText={val => setCredentials({ ...credential, userName: val })}
              style={[globalStyles.input, { backgroundColor: colors.surface, color: colors.text }]}
            />
            <TextInput
              returnKeyType="done"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Пароль"
              secureTextEntry
              value={credential.password}
              onChangeText={val => setCredentials({ ...credential, password: val })}
              style={[globalStyles.input, { backgroundColor: colors.surface, color: colors.text }]}
            />
            <Button
              mode="contained"
              disabled={serverReq.isLoading}
              icon="login"
              onPress={logIn}
              style={globalStyles.rectangularButton}
            >
              Войти
            </Button>
          </View>
          <View style={style.statusBox}>
            {serverReq.isError && <Text style={style.errorText}>Ошибка: {serverReq.status}</Text>}
            {serverReq.isLoading && <ActivityIndicator size="large" color="#70667D" />}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => {
            disconnect();
            console.log('disconnect');
          }}
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
