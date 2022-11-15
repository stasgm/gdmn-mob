/* eslint-disable max-len */
import {
  useDispatch,
  useDocThunkDispatch,
  useSelector,
  documentActions,
  appActions,
  authActions,
  useAuthThunkDispatch,
} from '@lib/store';

import { AuthLogOut, IDocument, IMessage } from '@lib/types';
import api from '@lib/client-api';

import { generateId } from '../utils';

import { getNextOrder } from './helpers';
import { useSaveErrors } from './useSaveErrors';

export const useSendDocs = (readyDocs: IDocument[]) => {
  const docDispatch = useDocThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);

  const docVersion = 1;
  let withError = false;
  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());
  const { saveErrors } = useSaveErrors();

  const addError = (name: string, message: string) => {
    const err = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      message,
    };
    dispatch(appActions.addErrorNotice(err));
    dispatch(appActions.addError(err));
    withError = true;
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
    addRequestNotice('Отправка документов');

    if (!user || !company || !appSystem || !user.erpUser) {
      addError(
        'useSendRefsRequest',
        // eslint-disable-next-line max-len
        `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
      );
    } else {
      const consumer = user.erpUser;
      const deviceId = config.deviceId!;
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
          appSystem,
          messageCompany,
          consumer,
          sendingDocsMessage,
          getNextOrder(),
          deviceId,
          authMiddleware,
        );

        if (sendMessageResponse.type === 'SEND_MESSAGE') {
          const updateDocResponse = await docDispatch(
            documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT' }))),
          );

          if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
            addError('useSendDocs: updateDocuments', updateDocResponse.payload);
          }
        } else {
          addError('useSendDocs: api.message.sendMessages', sendMessageResponse.message);
        }
      }
    }

    saveErrors();

    if (withError) {
      dispatch(appActions.setShowSyncInfo(true));
    }

    dispatch(appActions.setLoading(false));
  };
};
