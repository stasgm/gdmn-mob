/* eslint-disable max-len */
import {
  useDispatch,
  useDocThunkDispatch,
  useRefThunkDispatch,
  useAuthThunkDispatch,
  useSelector,
  documentActions,
  referenceActions,
  appActions,
  authActions,
} from '@lib/store';

import { BodyType, IDocument, IMessage, INamedEntity, IReferences, ISettingsOption, IUserSettings } from '@lib/types';
import api from '@lib/client-api';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const useSync = (onSync?: () => Promise<any>, onGetMessages?: () => Promise<any>): (() => void) => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const dispatch = useDispatch();

  const { user, company } = useSelector((state) => state.auth);
  const { list: documents } = useSelector((state) => state.documents);
  const { data: settings } = useSelector((state) => state.settings);

  const cleanDocTime = (settings.cleanDocTime as ISettingsOption<number>).data || 0;
  const refLoadType = (settings.refLoadType as ISettingsOption<boolean>).data;
  const isGetReferences = settings.getReferences?.data;

  const systemName = Constants.manifest?.extra?.slug;
  const consumer: INamedEntity = { id: '-1', name: systemName };
  const refVersion = 1;
  const docVersion = 1;
  const setVersion = 1;

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
      let transferMessage = '';
      console.log(111);
      const getTransfer = await api.transfer.getTransfer();
      console.log(222, getTransfer);

      if (getTransfer.type === 'ERROR') {
        errList.push(`Запрос на состояние учетной системы не отправлен: ${getTransfer.message}`);
      } else if (getTransfer.type === 'GET_TRANSFER' && getTransfer.status) {
        console.log(333);
        transferMessage =
          '\nСервер занят другим процессом.\nПовторите, пожалуйста, сихронизацию через несколько минут!';
      }

      // Загрузка данных
      // Если нет функции из пропсов и сервер не занят другим процессом (status = undefined)
      if (!onSync && getTransfer.type === 'GET_TRANSFER' && !getTransfer.status) {
        console.log(444);
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
              documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT' }))),
            );

            if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
              errList.push('Документы отправлены, но статус не обновлен');
            }
          } else {
            errList.push(`Документы не отправлены: ${sendMessageResponse.message}`);
          }
        }
        if (onGetMessages) {
          await onGetMessages();
        } else {
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
            errList.push(`Сообщения не получены: ${getMessagesResponse.message}`);
          }
        }

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

        if (isGetReferences) {
          //Формируем запрос на получение справочников для следующего раза
          const messageGetRef: IMessage['body'] = {
            type: 'CMD',
            version: refVersion,
            payload: {
              name: 'GET_REF',
            },
          };

          //3. Отправляем запрос на получение справочнико
          const sendMesRefResponse = await api.message.sendMessages(
            systemName,
            messageCompany,
            consumer,
            messageGetRef,
          );

          if (sendMesRefResponse?.type === 'ERROR') {
            errList.push(`Запрос на получение справочников не отправлен: ${sendMesRefResponse.message}`);
          }
        }

        //4. Отправляем запрос на получение документов
        const sendMesDocRespone = await api.message.sendMessages(systemName, messageCompany, consumer, messageGetDoc);

        if (sendMesDocRespone.type === 'ERROR') {
          errList.push(`Запрос на получение документов не отправлен: ${sendMesDocRespone.message}`);
        }

        if (cleanDocTime > 0) {
          //5. Удаляем обработанные документы, которые хранятся больше времени, которое указано в настройках
          const maxDocDate = new Date();
          maxDocDate.setDate(maxDocDate.getDate() - cleanDocTime);

          // const delPromises = documents
          //   .filter((d) => (d.status === 'PROCESSED' || d.status === 'ARCHIVE')
          // && new Date(d.documentDate) <= maxDocDate)
          //   .map(async (d) => {
          //     docDispatch(documentActions.removeDocument(d.id));
          //   });

          // await Promise.all(delPromises);
          const delDocs = documents
            .filter(
              (d) => (d.status === 'PROCESSED' || d.status === 'ARCHIVE') && new Date(d.documentDate) <= maxDocDate,
            )
            .map((d) => d.id);

          const delDocResponse = await docDispatch(documentActions.removeDocuments(delDocs));
          if (delDocResponse.type === 'DOCUMENTS/REMOVE_MANY_FAILURE') {
            errList.push('Старые обработанные документы не удалены');
          }
        }

        //7. Отправляем запрос на получение склада для юзера
        const sendMesDepartResponse = await api.message.sendMessages(
          systemName,
          messageCompany,
          consumer,
          messageGetDepart,
        );

        if (sendMesDepartResponse.type === 'ERROR') {
          errList.push(`Запрос на получение склада не отправлен: ${sendMesDepartResponse.message}`);
        }
      } else if (onSync) {
        // Если передан внешний обработчик то вызываем
        await onSync();
      }

      dispatch(appActions.setLoading(false));
      dispatch(appActions.setErrorList(errList));

      if (transferMessage) {
        Alert.alert('Внимание!', transferMessage, [{ text: 'OK' }]);
      } else if (errList?.length) {
        Alert.alert('Внимание!', `Во время синхронизации произошли ошибки:\n${errList.join('\n')}`, [{ text: 'OK' }]);
      } else {
        Alert.alert('Внимание!', 'Синхронизация прошла успешно!', [{ text: 'OK' }]);
        dispatch(appActions.setSyncDate(new Date()));
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
            const removeMess = await api.message.removeMessage(msg.id);
            if (removeMess.type === 'ERROR') {
              errList.push(`Справочники загружены, но сообщение на сервере не удалено: ${removeMess.message}`);
            }
          } else if (setRefResponse.type === 'REFERENCES/SET_ALL_FAILURE') {
            errList.push('Справочники не загружены в хранилище');
          }
        } else {
          //Записываем новые справочники из сообщения
          const addRefResponse = await refDispatch(referenceActions.addReferences(msg.body.payload as IReferences));

          //Если удачно сохранились справочники, удаляем сообщение в json
          if (addRefResponse.type === 'REFERENCES/ADD_SUCCESS') {
            const removeMess = await api.message.removeMessage(msg.id);
            if (removeMess.type === 'ERROR') {
              errList.push(`Справочники добавлены, но сообщение на сервере не удалено: ${removeMess.message}`);
            }
          } else if (addRefResponse.type === 'REFERENCES/ADD_FAILURE') {
            errList.push('Справочники не добавлены в хранилище');
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
          const removeMess = await api.message.removeMessage(msg.id);
          if (removeMess.type === 'ERROR') {
            errList.push(`Документы загружены, но сообщение на сервере не удалено: ${removeMess.message}`);
          }
        } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
          errList.push('Документы не загружены в хранилище');
        }

        break;
      }

      case 'SETTINGS': {
        //TODO: обработка
        if ((msg.body.version || 1) !== setVersion) {
          errList.push(
            `Структура загружаемых данных для  настроек пользователя с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        const setUserSettingsResponse = await authDispatch(
          authActions.setUserSettings(msg.body.payload as IUserSettings),
        );

        //Если удачно сохранились документы, удаляем сообщение в json
        if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_SUCCESS') {
          const removeMess = await api.message.removeMessage(msg.id);
          if (removeMess.type === 'ERROR') {
            errList.push(`Настройки пользователя загружены, но сообщение на сервере не удалено: ${removeMess.message}`);
          }
        } else if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_FAILURE') {
          errList.push('Настройки пользователя не загружены в хранилище');
        }
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
