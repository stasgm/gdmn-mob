import { useDispatch, useDocThunkDispatch } from '@lib/store';

import { useSelector, documentActions, appActions } from '@lib/store';
import { IDocument, IMessage, INamedEntity } from '@lib/types';
import api from '@lib/client-api';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const useSendDocs = (readyDocs: IDocument[]): (() => void) => {
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const { user, company } = useSelector((state) => state.auth);

  const systemName = Constants.manifest?.extra?.slug;
  const consumer: INamedEntity = { id: '-1', name: systemName };
  const docVersion = 1;

  const send = () => {
    if (!company || !user) {
      return;
    }

    dispatch(appActions.setLoading(true));
    dispatch(appActions.setErrorList([]));

    const errList: string[] = [];

    const sendData = async () => {
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
          systemName,
          messageCompany,
          consumer,
          sendingDocsMessage,
        );

        if (sendMessageResponse.type === 'SEND_MESSAGE') {
          const updateDocResponse = await docDispatch(
            documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT' }))),
          );

          if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
            errList.push(updateDocResponse.payload);
          }
        } else {
          errList.push(sendMessageResponse.message);
        }
      }

      dispatch(appActions.setLoading(false));
      dispatch(appActions.setErrorList(errList));

      if (errList?.length) {
        Alert.alert('Внимание!', 'Во время отправки документов произошли ошибки...', [{ text: 'OK' }]);
      }
    };

    sendData();
  };

  return send;
};

export default useSendDocs;
