import { useDispatch, useDocThunkDispatch, useRefThunkDispatch } from '@lib/store';

import { useSelector, documentActions, referenceActions, appActions } from '@lib/store';
import { BodyType, IDocument, IMessage, INamedEntity, IReferences } from '@lib/types';
import api from '@lib/client-api';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const useSync = (onSync?: () => void): () => void => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const dispatch = useDispatch();

  const { user, company } = useSelector((state) => state.auth);
  const { list: documents } = useSelector((state) => state.documents);

  const systemName = Constants.manifest?.extra?.slug;
  const consumer: INamedEntity = { id: '-1', name: systemName };

  const sync = () => {
    if (!company || !user) {
      return;
    }

    dispatch(appActions.setLoading(true));
    dispatch(appActions.setErrorList([]));

    const errList: string[] = [];

    /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
    const syncData = async () => {
      // Загрузка данных
      if (onSync) {
        // Если передан внешний обработчик то вызываем
        return onSync();
      }

      const messageCompany = { id: company.id, name: company.name };
      const readyDocs = documents.filter((doc) => doc.status === 'READY');

      // 1. Если есть документы, готовые для отправки (status = 'READY'),
      //    a. Формируем сообщение
      //    b. Отправляем сообщение с готовыми документами
      //    c. Если документы отправлены успешно, то меняем статус документов на 'SENT'
      if (readyDocs.length) {
        const sendingDocsMessage: IMessage['body'] = {
          type: 'DOCS',
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
            documentActions.updateDocuments(documents.map((d) => (d.status === 'READY' ? { ...d, status: 'SENT' } : d))),
          );

          if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
            errList.push(updateDocResponse.payload);
            // dispatch(appActions.setErrorMessage(updateDocResponse.payload));
          }
        } else {
          errList.push(sendMessageResponse.message);
          // dispatch(appActions.setErrorMessage(sendMessageResponse.message));
        }
      }

      //2. Получаем все сообщения для мобильного
      const getMessagesResponse = await api.message.getMessages({
        systemName,
        companyId: company.id,
      });

      //Если сообщения получены успешно, то
      //  справочники: очищаем старые и записываем в хранилище новые данные
      //  документы: добавляем новые, а старые заменеям только если был статус 'DRAFT'
      if (getMessagesResponse.type === 'GET_MESSAGES') {
        //await processMessages(getMessagesResponse.messageList);
        await Promise.all(getMessagesResponse.messageList?.map(message => processMessage(message, errList)))
      } else {
        errList.push(getMessagesResponse.message);
        //dispatch(appActions.setErrorMessage(getMessagesResponse.message));
      }

      //Формируем запрос на получение справочников для следующего раза
      const messageGetRef: IMessage['body'] = {
        type: 'CMD',
        payload: {
          name: 'GET_REF',
        },
      };

      //Формируем запрос на получение документов для следующего раза
      const messageGetDoc: IMessage['body'] = {
        type: 'CMD',
        payload: {
          name: 'GET_DOCUMENTS',
        },
      };

      //3. Отправляем запрос на получение справочников
      const sendMesRefResponse = await api.message.sendMessages(
        systemName,
        messageCompany,
        consumer,
        messageGetRef,
      );

      if (sendMesRefResponse.type === 'ERROR') {
        errList.push(sendMesRefResponse.message);
        //dispatch(appActions.setErrorMessage(sendMesRefResponse.message));
      }

      //4. Отправляем запрос на получение документов
      const sendMesDocRespone = await api.message.sendMessages(
        systemName,
        messageCompany,
        consumer,
        messageGetDoc,
      );

      if (sendMesDocRespone.type === 'ERROR') {
        errList.push(sendMesDocRespone.message);
        // dispatch(appActions.setErrorMessage(sendMesDocRespone.message));
      }

      dispatch(appActions.setLoading(false));
      dispatch(appActions.setErrorList(errList));

     console.log('err000', errList);

      if (errList?.length) {
        Alert.alert('Внимание!', 'Во время синхронизации произошли ошибки...', [{ text: 'OK' }]);
      }
    };

    syncData();
  };

  // const processMessages = async (arr: IMessage[]) => await Promise.all(arr?.map( message => processMessage(message) ) );

  const processMessage = async (msg: IMessage, errList: string[]) => {
    if (!msg) {
      return;
    }

    switch (msg.body.type as BodyType) {
      case 'CMD':
        //TODO: обработка
        break;

      case 'REFS': {
        //TODO: проверка данных, приведение к типу

        //Удаляем старые справочники из хранилища
        const clearRefResponse = await refDispatch(referenceActions.clearReferences());

        if (clearRefResponse.type === 'REFERENCES/CLEAR_REFERENCES_FAILURE') {
          errList.push(clearRefResponse.payload);
          //dispatch(appActions.setErrorMessage(clearRefResponse.payload));
          break;
        }

        //Записываем новые спарвочники из сообщения
        const setRefResponse = await refDispatch(referenceActions.setReferences(msg.body.payload as IReferences));

        //Если удачно сохранились справочники, удаляем сообщение в json
        if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
          await api.message.removeMessage(msg.id);
        } else if (setRefResponse.type === 'REFERENCES/SET_ALL_FAILURE') {
          errList.push(setRefResponse.payload);
          //dispatch(appActions.setErrorMessage(setRefResponse.payload));
        }

        break;
      }

      case 'DOCS': {
        const setDocResponse = await docDispatch(documentActions.setDocuments(msg.body.payload as IDocument[]));

        console.log('setDocResponse', setDocResponse);

        //Если удачно сохранились документы, удаляем сообщение в json
        if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
          await api.message.removeMessage(msg.id);
        } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
          errList.push(setDocResponse.payload);
          //dispatch(appActions.setErrorMessage(setDocResponse.payload));
        }

        break;
      }

      default:
        errList.push('Неизвестный тип сообщения');
        //dispatch(appActions.setErrorMessage('Неизвестный тип сообщения'));
        break;
    }
  };

  return sync;
};

export default useSync;
