/* eslint-disable max-len */
import { useDispatch, useDocThunkDispatch, useSelector, documentActions, appActions } from '@lib/store';

import { IAppSystem, IDocument, IMessage } from '@lib/types';
import api from '@lib/client-api';
import { Alert } from 'react-native';

import { getNextOrder } from './orderCounter';

const useSendDocs = (readyDocs: IDocument[]): (() => void) => {
  const docDispatch = useDocThunkDispatch();
  const dispatch = useDispatch();

  const { user, company, config } = useSelector((state) => state.auth);

  const docVersion = 1;

  const send = () => {
    if (!user || !user.erpUser) {
      Alert.alert(
        'Внимание!',
        `Для ${user?.name} не указан пользователь ERP!\nПожалуйста, обратитесь к администратору.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (!company) {
      Alert.alert(
        'Внимание!',
        `Для пользователя ${user.name} не определена компания!\nПожалуйста, выполните выход из профиля и заново залогиньтесь под вашей учетной записью`,
        [{ text: 'OK' }],
      );
      return;
    }

    dispatch(documentActions.setLoading(true));
    dispatch(appActions.setErrorList([]));

    const errList: string[] = [];

    const consumer = user.erpUser;

    const deviceId = config.deviceId!;

    const sendData = async () => {
      const getErpUser = await api.user.getUser(consumer.id);

      let appSystem: IAppSystem | undefined;
      if (getErpUser.type === 'ERROR') {
        errList.push(`Пользователь ERP не определен: ${getErpUser.message}`);
      }

      if (getErpUser.type === 'GET_USER') {
        if (!getErpUser.user.appSystem) {
          errList.push('У пользователя ERP не установлена подсистема!\nПожалуйста, обратитесь к администратору.');
        } else {
          appSystem = getErpUser.user.appSystem;
        }
      }

      if (appSystem) {
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
    };

    dispatch(documentActions.setLoading(false));
    dispatch(appActions.setErrorList(errList));

    if (errList?.length) {
      Alert.alert('Внимание!', `Во время отправки документов произошли ошибки:\n${errList.join('\n')}`, [
        { text: 'OK' },
      ]);
    } else {
      Alert.alert('Внимание!', 'Отправка прошла успешно!', [{ text: 'OK' }]);
      // dispatch(appActions.setSyncDate(new Date()));
    }

    sendData();
  };

  return send;
};

export default useSendDocs;
