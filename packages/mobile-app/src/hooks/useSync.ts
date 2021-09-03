import { useDispatch, useDocThunkDispatch, useRefThunkDispatch } from '@lib/store';

import { useSelector, documentActions, referenceActions, appActions } from '@lib/store';
import { BodyType, IDocument, IMessage, INamedEntity, IReferences, ISettingsOption } from '@lib/types';
import api from '@lib/client-api';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { Consumer } from '@expo/react-native-action-sheet/lib/typescript/context';

const useSync = (onSync?: () => void): (() => void) => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const dispatch = useDispatch();

  const { user, company } = useSelector((state) => state.auth);
  const { list: documents } = useSelector((state) => state.documents);
  const { data: settings } = useSelector((state) => state.settings);

  const cleanDocTime = (settings['cleanDocTime'] as ISettingsOption<number>).data;
  const refLoadType = (settings['refLoadType'] as ISettingsOption<boolean>).data;

  const systemName = Constants.manifest?.extra?.slug;
  const consumer: INamedEntity = { id: '-1', name: systemName };
  const refVersion = 1;
  const docVersion = 1;

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
            documentActions.updateDocuments(
              documents.map((d) => (d.status === 'READY' ? { ...d, status: 'SENT' } : d)),
            ),
          );

          if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
            errList.push(updateDocResponse.payload);
          }
        } else {
          errList.push(sendMessageResponse.message);
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
        await Promise.all(getMessagesResponse.messageList?.map((message) => processMessage(message, errList)));
      } else {
        errList.push(getMessagesResponse.message);
      }

      //Формируем запрос на получение справочников для следующего раза
      const messageGetRef: IMessage['body'] = {
        type: 'CMD',
        version: refVersion,
        payload: {
          name: 'GET_REF',
        },
      };

      //Формируем запрос на получение документов для следующего раза
      const messageGetDoc: IMessage['body'] = {
        type: 'CMD',
        version: docVersion,
        payload: {
          name: 'GET_DOCUMENTS',
        },
      };

      //Формируем запрос на получение склада для юзера
      const messageGetDepart: IMessage['body'] = {
        type: 'CMD',
        version: docVersion,
        payload: {
          name: 'GET_USER_SETTINGS',
        },
      };

      //3. Отправляем запрос на получение справочников
      const sendMesRefResponse = await api.message.sendMessages(systemName, messageCompany, consumer, messageGetRef);

      if (sendMesRefResponse.type === 'ERROR') {
        errList.push(sendMesRefResponse.message);
      }

      //4. Отправляем запрос на получение документов
      const sendMesDocRespone = await api.message.sendMessages(systemName, messageCompany, consumer, messageGetDoc);

      if (sendMesDocRespone.type === 'ERROR') {
        errList.push(sendMesDocRespone.message);
      }

      if (cleanDocTime > 0) {
        //5. Удаляем обработанные документы, которые хранятся больше времени, которое указано в настройках
        const maxDocDate = new Date();
        maxDocDate.setDate(maxDocDate.getDate() - cleanDocTime);

        const delPromises = documents
          .filter((d) => d.status === 'PROCESSED' && new Date(d.documentDate) <= maxDocDate)
          .map(async (d) => {
            await docDispatch(documentActions.removeDocument(d.id));
          });

        await Promise.all(delPromises);
      }

      //7. Отправляем запрос на получение склада для юзера
      const sendMesDepartResponse = await api.message.sendMessages(
        systemName,
        messageCompany,
        consumer,
        messageGetDepart,
      );

      if (sendMesDepartResponse.type === 'ERROR') {
        errList.push(sendMesDepartResponse.message);
      }

      dispatch(appActions.setLoading(false));
      dispatch(appActions.setErrorList(errList));

      if (errList?.length) {
        Alert.alert('Внимание!', 'Во время синхронизации произошли ошибки...', [{ text: 'OK' }]);
      }
    };

    syncData();
  };

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
        console.log('msg.body.version', msg.body.version);
        if ((msg.body.version || 1) !== refVersion) {
          errList.push(
            `Структура загружаемых данных для справочников с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        if (refLoadType) {
          //Записываем новые справочники из сообщения
          const setRefResponse = await refDispatch(referenceActions.setReferences(msg.body.payload as IReferences));

          //Если удачно сохранились справочники, удаляем сообщение в json
          if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
            await api.message.removeMessage(msg.id);
          } else if (setRefResponse.type === 'REFERENCES/SET_ALL_FAILURE') {
            errList.push(setRefResponse.payload);
          }
          // //Удаляем старые справочники из хранилища
          // const clearRefResponse = await refDispatch(referenceActions.clearReferences());

          // if (clearRefResponse.type === 'REFERENCES/CLEAR_REFERENCES_FAILURE') {
          //   errList.push(clearRefResponse.payload);
          //   break;
          // }
        } else {
          //Записываем новые справочники из сообщения
          const addRefResponse = await refDispatch(referenceActions.addReferences(msg.body.payload as IReferences));

          //Если удачно сохранились справочники, удаляем сообщение в json
          if (addRefResponse.type === 'REFERENCES/ADD_SUCCESS') {
            await api.message.removeMessage(msg.id);
          } else if (addRefResponse.type === 'REFERENCES/ADD_FAILURE') {
            errList.push(addRefResponse.payload);
          }
        }

        break;
      }

      case 'DOCS': {
        if ((msg.body.version || 1) !== docVersion) {
          errList.push(
            `Структура загружаемых данных для документов с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        const setDocResponse = await docDispatch(documentActions.setDocuments(msg.body.payload as IDocument[]));

        //Если удачно сохранились документы, удаляем сообщение в json
        if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
          await api.message.removeMessage(msg.id);
        } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
          errList.push(setDocResponse.payload);
        }

        break;
      }

      case 'SETTINGS': {
        //TODO: обработка
        break;
      }

      default:
        errList.push('Неизвестный тип сообщения');
        break;
    }
  };

  return sync;
};

export default useSync;
