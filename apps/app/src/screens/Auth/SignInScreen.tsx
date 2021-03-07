import React, { useState, useEffect, useCallback } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, TextInput, IconButton, Button, ActivityIndicator, useTheme } from 'react-native-paper';

import { IDataFetch, IUserCredentials } from '@lib/types';

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
  const [loginState, setLoginState] = useState<IDataFetch>({
    isLoading: false,
    isError: false,
    status: undefined,
  });

  const { signIn } = useAuth();

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

  const logIn = useCallback(async () => {
    Keyboard.dismiss();

    try {
      setLoginState({ isError: false, isLoading: true, status: undefined });

      const res = await signIn(credential);

      if (res) {
        return setLoginState({ isError: false, isLoading: false, status: undefined });
      }
      setLoginState({ isError: true, isLoading: false, status: 'Что-то не так' });
    } catch (e) {
      setLoginState({ isError: true, isLoading: false, status: e });
      throw new Error(e);
    }
  }, [credential, signIn]);

  useEffect(() => {
    if (!loginState.isLoading) {
      return;
    }

    /*  const LoginUser = async () => {
       try {
         const device = await apiService.getDeviceByUser(credential.userName);

         if (device.error === 'устройство не найдено') {
           // Устройство не найдено. Перенаправляем на ввод кода активации
           authActions.setUserStatus({ userID: null, userName: undefined });
           authActions.setDeviceStatus(false);
           return;
         }

         if (!device.result) {
           setLoginState({
             isLoading: false,
             status: device.error,
             isError: true,
           });
           return;
         }
       } catch (err) {
         setLoginState({
           isLoading: false,
           status: err.message,
           isError: true,
         });
         return;
       }

       try {
         const res = await timeout<IResponse<string>>(apiService.baseUrl.timeout, apiService.auth.login(credential));

         if (!res.result) {
           setLoginState({
             isLoading: false,
             status: res.error,
             isError: true,
           });
           return;
         }

         // Получение данных пользователя
         const result = await apiService.auth.getUserStatus();

         if (!isUser(result.data)) {
           authActions.setUserStatus({ userID: null, userName: undefined });
           setLoginState({ isLoading: false, isError: true, status: 'ошибка при получении пользователя' });
           return;
         }
         const user = result.data as IUser;
         authActions.setUserStatus({
           userID: user.id,
           userName: user.firstName ? `${user.firstName} ${user.lastName}` : user.userName,
         });
       } catch (err) {
         setLoginState({
           isLoading: false,
           status: err.message,
           isError: true,
         });
       }
     };
     LoginUser();
     */
  }, [loginState.isLoading]);

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
              disabled={loginState.isLoading}
              icon="login"
              onPress={logIn}
              style={globalStyles.rectangularButton}
            >
              Войти
            </Button>
          </View>
          <View style={style.statusBox}>
            {loginState.isError && <Text style={style.errorText}>Ошибка: {loginState.status}</Text>}
            {loginState.isLoading && <ActivityIndicator size="large" color="#70667D" />}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <View style={globalStyles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => {
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
