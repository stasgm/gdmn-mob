import {
  useDispatch,
  useDocThunkDispatch,
  useSelector,
  documentActions,
  appActions,
  authActions,
  useAuthThunkDispatch,
} from '@lib/store';

import { IDeviceLog, IDocument, IMessage } from '@lib/types';
import api, { isConnectError } from '@lib/client-api';

import { useMemo } from 'react';

import { generateId } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { getNextOrder } from './helpers';
import { useSaveErrors } from './useSaveErrors';

export const useSendDocs = (readyDocs: IDocument[]) => {
  const docDispatch = useDocThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);

  const docVersion = 1;
  const deviceId = config.deviceId!;
  const { saveErrors } = useSaveErrors();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);

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

  const addRequestNotice = (message: string) => {
    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message,
      }),
    );
  };

  return async () => {
    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    const tempErrs: IDeviceLog[] = [];
    let connectError = false;

    if (!user || !company || !appSystem || !user.erpUser) {
      addError(
        'useSendDocs',
        `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
        tempErrs,
      );
    } else {
      addRequestNotice('Проверка статуса устройства');

      const statusRespone = await api.auth.getDeviceStatus(appRequest, deviceId);
      if (statusRespone.type !== 'GET_DEVICE_STATUS') {
        addError('useSendDocs: getDeviceStatus', `Статус устройства не получен. ${statusRespone.message}`, tempErrs);
        connectError = isConnectError(statusRespone.type);
      } else {
        authDispatch(
          authActions.setConnectionStatus(statusRespone.status === 'ACTIVE' ? 'connected' : 'not-activated'),
        );
      }
      if (!tempErrs.length) {
        addRequestNotice('Отправка документов');

        const consumer = user.erpUser;
        const messageCompany = { id: company.id, name: company.name };

        // 1. Если есть документы, готовые для отправки (status = 'READY'),
        //    a. Формируем сообщение
        //    b. Отправляем сообщение с готовыми документами
        //    c. Если документы отправлены успешно, то меняем статус документов на 'SENT'
        if (readyDocs.length) {
          const sendingDocsMessage: IMessage['body'] = {
            type: 'DOCS',
            version: docVersion,
            payload: readyDocs,
          };

          const sendMessageResponse = await api.message.sendMessages(
            appRequest,
            appSystem,
            messageCompany,
            consumer,
            sendingDocsMessage,
            getNextOrder(),
            deviceId,
          );

          if (sendMessageResponse.type === 'SEND_MESSAGE') {
            const updateDocResponse = await docDispatch(
              documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT' }))),
            );

            if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
              addError('useSendDocs: updateDocuments', updateDocResponse.payload, tempErrs);
            }
          } else {
            addError('useSendDocs: api.message.sendMessages', sendMessageResponse.message, tempErrs);
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
