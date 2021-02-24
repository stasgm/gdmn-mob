/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import { IServiceContextProps, IServiceState } from '../../model/types';
import Api from '../../service/Api';
import Storage from '../../service/Storage';
import { useTypesafeActions } from '../utils';
import { ServiceActions } from './actions';
import { initialState, reducer } from './reducer';

const apiService = new Api();
const storageService = new Storage();

const defaultAppState: IServiceContextProps = {
  state: initialState,
  actions: ServiceActions,
  apiService,
  storageService,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IServiceContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IServiceState, typeof ServiceActions>(
      reducer,
      initialState,
      ServiceActions,
    );

    /* Загружаем глобальные настройки приложения */
    useEffect(() => {
      const loacData = async () => {
        actions.setLoading(true);
        actions.setServerUrl(await storageService.getServer()); // Загружаем путь к серверу из хранилища в стейт
        actions.setDeviceId(await storageService.getDeviceId()); // Загружаем deviceId из хранилища в стейт
        actions.setLoading(false);
      };

      loacData();
    }, []);

    /* При изменении значения DeviceId в стейте сохраняем в storage */
    useEffect(() => {
      const saveState = async () => {
        if (!state.isLoading) {
          // записываем deviceId в хранилище устройства
          storageService.setDeviceId(state.deviceId);
        }
        apiService.setDeviceId(state.deviceId); // в службе Service обновляем deviceId
      };

      if (state.deviceId !== undefined) {
        saveState();
      }
    }, [actions, state.deviceId]);

    /* При изменении значения serverUrl в стейте сохраняем в storage */
    useEffect(() => {
      const saveState = async () => {
        if (!state.isLoading) {
          // записываем путь к серверу в хранилище утройства
          storageService.setServer(state.serverUrl.timeout ? state.serverUrl : { ...state.serverUrl, timeout: 5000 });
        }
        apiService.setUrl(state.serverUrl.timeout ? state.serverUrl : { ...state.serverUrl, timeout: 5000 }); // в службе Service обновляем путь к серверу
      };
      if (state.serverUrl) {
        saveState();
      }
    }, [actions, state.serverUrl]);

    return (
      <StoreContext.Provider value={{ state, actions, apiService, storageService }}>{children}</StoreContext.Provider>
    );
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
