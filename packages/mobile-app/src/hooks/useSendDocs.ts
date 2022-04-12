import { useDispatch, useDocThunkDispatch, useSelector, documentActions, appActions } from '@lib/store';

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
    dispatch(documentActions.setLoading(true));
    dispatch(appActions.setErrorList([]));

    const errList: string[] = [];

    const sendData = async () => {
      let transferMessage = '';
      const getTransfer = await api.transfer.getTransfer();

      if (getTransfer.type === 'ERROR') {
        errList.push(`Запрос на состояние учетной системы не отправлен: ${getTransfer.message}`);
      } else if (getTransfer.type === 'GET_TRANSFER' && getTransfer.status) {
        transferMessage =
          '\nСервер занят другим процессом.\nПовторите, пожалуйста, сихронизацию через несколько минут!';
      }

      // Отправка данных
      // Если сервер не занят другим процессом (status = undefined)
      if (getTransfer.type === 'GET_TRANSFER' && !getTransfer.status) {
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
      }

      dispatch(documentActions.setLoading(false));
      dispatch(appActions.setErrorList(errList));

      if (transferMessage) {
        Alert.alert('Внимание!', transferMessage, [{ text: 'OK' }]);
      } else if (errList?.length) {
        Alert.alert('Внимание!', `Во время отправки документов произошли ошибки:\n${errList.join('\n')}`, [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Внимание!', 'Отправка прошла успешно!', [{ text: 'OK' }]);
        dispatch(appActions.setSyncDate(new Date()));
      }
    };

    sendData();
  };

  return send;
};

export default useSendDocs;
