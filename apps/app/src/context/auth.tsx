import { IBaseUrl, IDevice, IUser, IUserCredentials } from '@lib/types';
import React, { createContext, useEffect, useContext, useReducer } from 'react';

import { config, user, device } from '../screens/Auth/constants';

import api from '../services/api';

import { IAuthContextData, reducer, initialState } from './reducer';

const isUser = (obj: unknown): obj is IUser => obj instanceof Object && 'id' && 'userName' in obj;
const isDevice = (obj: unknown): obj is IDevice => obj instanceof Object && 'id' && 'name' in obj;

const AuthContext = createContext<IAuthContextData>(initialState);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useReducer(reducer, initialState);

  const loadStoragedData = async () => {
    setAuthState({ type: 'LOAD_DATA', settings: config, device: undefined, user: undefined });
    console.log('load settngs');
  };

  const checkDevice = async (): Promise<void> => {
    try {
      setAuthState({ type: 'SET_CONNECTION' });

      // const response = await api.getDevice();

      await sleep(2000);

      const deviceObj: IDevice = device;

      if (isDevice(deviceObj)) {
        setAuthState({ type: 'SET_DEVICE', device: deviceObj });
        return;
      }

      // устройства нет на сервере, сбросим DeviceId на сутройстве
      setAuthState({ type: 'SET_DEVICE_ERROR', text: 'ошибка сервера' });
    } catch (err) {
      setAuthState({ type: 'SET_ERROR', text: err.message });
      console.log('error:', err);
    }
  };

  const activate = async (code: string): Promise<void> => {
    try {
      setAuthState({ type: 'SET_CONNECTION' });

      const response = await api.verifyActivationCode(code);

      if (isDevice(response.result)) {
        setAuthState({ type: 'SET_DEVICE', device: response.result });
        return;
      }

      setAuthState({ type: 'SET_ERROR', text: 'ошибка сервера' });
    } catch (err) {
      setAuthState({ type: 'SET_ERROR', text: err.message });
      console.log('error:', err);
    }
  };

  const showSettings = async (visible: boolean): Promise<void> => {
    setAuthState({ type: 'SETTINGS_FORM', visible });
  };

  const setSettings = async (settings: IBaseUrl): Promise<void> => {
    setAuthState({ type: 'SET_SETTINGS', settings });
  };

  const signIn = async (authUser: IUserCredentials): Promise<void> => {
    if (!(authUser.userName && authUser.password)) {
      setAuthState({ type: 'SET_ERROR', text: 'Не указан пользователь и\\или пароль' });
      return;
    }

    setAuthState({ type: 'SET_CONNECTION' });

    try {
      /*
        const response = await api.login({
          userName: authUser.userName,
          password: authUser.password,
        });

         const userObj = response.data;
      */
      await sleep(2000);

      const userObj: IUser = user;

      if (isUser(userObj)) {
        setAuthState({ type: 'SET_USER', user: userObj });
        return;
      }

      // пользователь не соответствует структуре
      setAuthState({ type: 'SET_USER_ERROR', text: 'ошибка сервера' });
    } catch (err) {
      setAuthState({ type: 'SET_ERROR', text: err.message });
      console.log('error:', err);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // const response = await api.logout();
      // const res = response.result;
      const res = true;
      if (res) {
        setAuthState({ type: 'SET_USER', user: null });
        // setUser(null);
        return;
      }
      setAuthState({ type: 'SET_ERROR', text: 'ошибка сервера' });
    } catch (err) {
      setAuthState({ type: 'SET_ERROR', text: err.message });
    }
  };

  const disconnect = async (): Promise<void> => {
    setAuthState({ type: 'LOAD_DATA', settings: authState.settings, device: undefined, user: undefined });
  };

  useEffect(() => {
    loadStoragedData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authState, checkDevice, signIn, signOut, disconnect, setSettings, showSettings, activate }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };
