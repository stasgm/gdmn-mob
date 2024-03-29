import {
  useDispatch,
  useDocThunkDispatch,
  useSelector,
  documentActions,
  appActions,
  authActions,
  useAuthThunkDispatch,
} from '@lib/store';

import { IDocument, IMessage } from '@lib/types';
import api from '@lib/client-api';

import { useCallback, useMemo } from 'react';

import { addError, addRequestNotice } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { useCheckDeviceStatus } from '../useCheckDeviceStatus';

import { getNextOrder } from './helpers';

//TODO: Может лучше передавать функцию для получения sendingDocs вместо sendingDocs?
export const useSendDocs = (readyDocs: IDocument[], sendingDocs: IDocument[] = readyDocs) => {
  const docDispatch = useDocThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const checkDeviceStatus = useCheckDeviceStatus();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);

  return useCallback(async () => {
    try {
      dispatch(appActions.setLoading(true));
      dispatch(appActions.clearRequestNotice());
      dispatch(appActions.clearErrorNotice());

      if (!user || !company || !appSystem || !user.erpUser || !config.deviceId) {
        throw new Error(
          `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}, id устройства ${config.deviceId}`,
        );
      }

      addRequestNotice(dispatch, 'Проверка статуса устройства');
      await checkDeviceStatus();

      addRequestNotice(dispatch, 'Отправка документов');

      const messageCompany = { id: company.id, name: company.name };

      // 1. Если есть документы, готовые для отправки (status = 'READY'),
      //    a. Формируем сообщение
      //    b. Отправляем сообщение с готовыми документами
      //    c. Если документы отправлены успешно, то меняем статус документов на 'SENT'
      if (readyDocs.length) {
        const sendingDocsMessage: IMessage['body'] = {
          type: 'DOCS',
          version: 1,
          payload: sendingDocs,
        };

        const sendMessageResponse = await api.message.sendMessages(
          appRequest,
          appSystem,
          messageCompany,
          user.erpUser,
          sendingDocsMessage,
          getNextOrder(),
          config.deviceId,
        );

        if (sendMessageResponse.type === 'SEND_MESSAGE') {
          const sentDate = new Date().toISOString();
          const updateDocResponse = await docDispatch(
            documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT', sentDate }))),
          );

          if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
            throw new Error(`Ошибка обновления статуса документов: ${updateDocResponse.payload}`);
          }
        } else {
          throw new Error(`Документы не отправлены: ${sendMessageResponse.message}`);
        }
      }
    } catch (error: any) {
      addError(
        dispatch,
        'useSendDocs:',
        typeof error.message === 'string' ? error.message : 'Ошибка отправки документов',
        'useSendDocs',
        false,
      );
      dispatch(appActions.setShowSyncInfo(true));
    } finally {
      dispatch(appActions.setLoading(false));
    }
  }, [
    appRequest,
    appSystem,
    checkDeviceStatus,
    company,
    config.deviceId,
    dispatch,
    docDispatch,
    readyDocs,
    sendingDocs,
    user,
  ]);
};
