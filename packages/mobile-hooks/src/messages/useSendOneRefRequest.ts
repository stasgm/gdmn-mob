import {
  useDispatch,
  useSelector,
  appActions,
  authActions,
  useAuthThunkDispatch,
  useAppStore,
  RootState,
} from '@lib/store';

import { ICmdParams, IDeviceLog, IMessage } from '@lib/types';
import api, { isConnectError } from '@lib/client-api';

import { useMemo } from 'react';

import { generateId } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { getNextOrder, needRequest } from './helpers';
import { useSendDeviceLog } from './useSendDeviceLog';

export const useSendOneRefRequest = (description: string, params: ICmdParams) => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const store = useAppStore();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const refVersion = 1;
  const deviceId = config.deviceId!;
  const saveErrors = useSendDeviceLog();

  const addRequestNotice = (message: string) => {
    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message,
      }),
    );
  };

  const addError = (name: string, message: string, tempErrs: IDeviceLog[]) => {
    const err = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      message,
    };
    dispatch(appActions.addErrorNotice(err));
    tempErrs.push(err);
  };

  return async () => {
    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    const tempErrs: IDeviceLog[] = [];
    let connectError = false;

    if (!user || !company || !appSystem || !user.erpUser) {
      addError(
        'useSendOneRefRequest',
        `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
        tempErrs,
      );
    } else {
      addRequestNotice('Проверка статуса устройства');

      const statusRespone = await api.auth.getDeviceStatus(appRequest, deviceId);
      if (statusRespone.type !== 'GET_DEVICE_STATUS') {
        addError(
          'useSendOneRefRequest: getDeviceStatus',
          `Статус устройства не получен. ${statusRespone.message}`,
          tempErrs,
        );
        connectError = isConnectError(statusRespone.type);
      } else {
        authDispatch(
          authActions.setConnectionStatus(statusRespone.status === 'ACTIVE' ? 'connected' : 'not-activated'),
        );
      }
      if (!tempErrs.length) {
        const state = store.getState() as RootState;
        const currentDate = new Date();
        const syncRequests = state.app.syncRequests || [];
        const isRemains = typeof params === 'object' && 'name' in params && params.name === 'remains';
        const needSendRequest = isRemains ? needRequest(syncRequests, 'GET_REMAINS', currentDate) : true;
        //Если запрос такого типа не был отправлен или время запроса меньше текущего на час, то отправляем
        if (needSendRequest) {
          addRequestNotice(`Запрос на получение справочника: ${description}`);

          const messageCompany = { id: company.id, name: company.name };
          const consumer = user.erpUser;

          //Формируем запрос на получение справочника
          const messageGetRef: IMessage['body'] = {
            type: 'CMD',
            version: refVersion,
            payload: {
              name: 'GET_ONE_REF',
              params,
            },
          };

          //Отправляем запрос на получение справочника
          const sendMesRefResponse = await api.message.sendMessages(
            appRequest,
            appSystem,
            messageCompany,
            consumer,
            messageGetRef,
            getNextOrder(),
            deviceId,
          );

          if (sendMesRefResponse.type !== 'SEND_MESSAGE') {
            addError('useSendOneRefRequest: api.message.sendMessages', sendMesRefResponse.message, tempErrs);
          } else if (sendMesRefResponse.type === 'SEND_MESSAGE' && isRemains) {
            dispatch(
              appActions.addSyncRequest({
                cmdName: 'GET_REMAINS',
                date: currentDate,
              }),
            );
          }
        }
      }
    }

    if (tempErrs.length) {
      dispatch(appActions.setShowSyncInfo(true));
    }

    if (!connectError) {
      saveErrors(tempErrs);
    } else if (tempErrs.length) {
      dispatch(appActions.addErrors(tempErrs));
    }

    dispatch(appActions.setLoading(false));
  };
};
