import { useDispatch, useDocThunkDispatch, useRefThunkDispatch } from '@lib/store';

import { useSelector, documentActions, referenceActions, appActions } from '@lib/store';
import { BodyType, IDocument, IMessage, INamedEntity, IReferences } from '@lib/types';
import api from '@lib/client-api';
import Constants from 'expo-constants';

const useSync = (onSync?: () => void): () => void => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const dispatch = useDispatch();

  const { user, company } = useSelector((state) => state.auth);
  const { list: documents } = useSelector((state) => state.documents);

  const systemName = Constants.manifest?.extra?.backUserAlias;
  const consumer: INamedEntity = { id: '-1', name: systemName };

  const sync = () => {
    dispatch(appActions.setLoading({ loading: true }));

    if (!company || !user) {
      return;
    }

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
          console.log('readyDocs', readyDocs.length, documents.length);
          await docDispatch(
            documentActions.updateDocuments(documents.map((d) => (d.status === 'READY' ? { ...d, status: 'SENT' } : d))),
          );
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
        await processMessages(getMessagesResponse.messageList);
      } else if (getMessagesResponse.type === 'ERROR') {
        //Alert.alert('Ошибка!', getMessagesResponse.message, [{ text: 'Закрыть' }]);
        dispatch(appActions.setLoading({ loading: false, errorMessage: getMessagesResponse.message }));
        return;
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
      await api.message.sendMessages(
        systemName,
        messageCompany,
        consumer,
        messageGetRef,
      );

      //4. Отправляем запрос на получение документов
      await api.message.sendMessages(
        systemName,
        messageCompany,
        consumer,
        messageGetDoc,
      );

      dispatch(appActions.setLoading({ loading: false }));
    };

    syncData();
  };

  const processMessages = async (arr: IMessage[]) => await Promise.all(arr?.map( message => processMessage(message) ) );

  const processMessage = async (msg: IMessage) => {
    if (!msg) {
      return;
    }

    switch (msg.body.type as BodyType) {
      case 'CMD':
        //TODO: обработка
        break;

      case 'REFS': {
        //TODO: проверка данных, приведение к типу
        const clearRefResponse = await refDispatch(referenceActions.clearReferences());

        if (clearRefResponse.type === 'REFERENCES/CLEAR_REFERENCES_FAILURE') {
          break;
        }

        const setRefResponse = await refDispatch(referenceActions.setReferences(msg.body.payload as IReferences));

        //Если удачно сохранились справочники, удаляем сообщение в json
        if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
          await api.message.removeMessage(msg.id);
        }
        break;
      }

      case 'DOCS': {
        const setDocResponse = await docDispatch(documentActions.setDocuments(msg.body.payload as IDocument[]));

        //Если удачно сохранились документы, удаляем сообщение в json
        if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
          await api.message.removeMessage(msg.id);
        }
        break;
      }

      default:
        // Alert.alert('Предупреждение!', 'Неизвестный тип сообщения', [{ text: 'Закрыть' }]);
        dispatch(appActions.setLoading({ loading: false, errorMessage: 'Неизвестный тип сообщения' }));
        break;
    }
  };

  return sync;
};

export default useSync;
