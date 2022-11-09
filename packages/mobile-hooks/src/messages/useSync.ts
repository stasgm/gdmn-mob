/* eslint-disable max-len */
import {
  useDispatch,
  useDocThunkDispatch,
  useRefThunkDispatch,
  useAuthThunkDispatch,
  useSettingThunkDispatch,
  useSelector,
  documentActions,
  referenceActions,
  appActions,
  authActions,
  settingsActions,
} from '@lib/store';

import {
  AuthLogOut,
  BodyType,
  IAppSystemSettings,
  IDocument,
  IMessage,
  IReferences,
  ISettingsOption,
  IUserSettings,
} from '@lib/types';
import api from '@lib/client-api';

import { generateId, getDateString, isIReferences, sleep } from '../utils';

import { getNextOrder } from './helpers';

export const useSync = (onSync?: () => Promise<any>): (() => void) => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const settDispatch = useSettingThunkDispatch();
  const dispatch = useDispatch();

  const addErrorNotice = (name: string, message: string) => {
    const err = {
      id: generateId(),
      name,
      date: new Date(),
      message,
    };
    dispatch(appActions.addErrorNotice(err));
    dispatch(appActions.addError(err));
  };

  const addRequestNotice = (message: string) => {
    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message,
      }),
    );
  };

  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const { errorNotice, errorList } = useSelector((state) => state.app);
  const documents = useSelector((state) => state.documents.list);
  const settings = useSelector((state) => state.settings.data);

  const cleanDocTime = (settings.cleanDocTime as ISettingsOption<number>).data || 0;
  const refLoadType = (settings.refLoadType as ISettingsOption<boolean>).data;
  const isGetReferences = settings.getReferences?.data;
  const deviceId = config.deviceId!;

  const refVersion = 1;
  const docVersion = 1;
  const setVersion = 1;

  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());

  const sync = () => {
    /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
    const syncData = async () => {
      // Загрузка данных
      try {
        dispatch(appActions.setLoading(true));
        dispatch(appActions.clearRequestNotice());
        dispatch(appActions.clearErrorNotice());

        if (!user || !company || !appSystem || !user.erpUser) {
          addErrorNotice(
            'useSync',
            `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
          );

          dispatch(appActions.setShowSyncInfo(true));
          dispatch(appActions.setLoading(false));
          return;
        }

        if (!onSync) {
          // Если нет функции из пропсов
          const mesParams = {
            appSystemId: appSystem.id,
            companyId: company.id,
          };
          const messageCompany = { id: company.id, name: company.name };
          const consumer = user.erpUser;

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

            addRequestNotice('Отправка документов на сервер');

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
                addErrorNotice(
                  'useSync: updateDocuments',
                  `Документы ${readyDocs.map((doc) => doc.number).join(', ')} отправлены, но статус не обновлен`,
                );
              }
            } else {
              addErrorNotice(
                'useSync: api.message.sendMessages',
                `Документы ${readyDocs.map((doc) => doc.number).join(', ')} не отправлены, ${
                  sendMessageResponse.message
                }`,
              );
            }
          }

          addRequestNotice('Получение данных');

          //2. Получаем все сообщения для мобильного
          const getMessagesResponse = await api.message.getMessages(mesParams, authMiddleware);

          //Если сообщения получены успешно, то
          //  справочники: очищаем старые и записываем в хранилище новые данные
          //  документы: добавляем новые, а старые заменеям только если был статус 'DRAFT'
          if (getMessagesResponse.type === 'GET_MESSAGES') {
            const sortedMessages = getMessagesResponse.messageList.sort((a, b) => a.head.order - b.head.order);
            for (const message of sortedMessages) {
              // eslint-disable-next-line no-await-in-loop
              await processMessage(message, mesParams);
            }
            // await Promise.all(
            //   getMessagesResponse.messageList
            //     .sort((a, b) => a.head.order - b.head.order)
            //     ?.map((message) => processMessage(message, errList, okList, params)),
            // );
          } else {
            addErrorNotice('useSync: api.message.getMessages', `Сообщения не получены: ${getMessagesResponse.message}`);
          }

          //Формируем запрос на получение документов для следующего раза
          const messageGetDoc: IMessage['body'] = {
            type: 'CMD',
            version: docVersion,
            payload: {
              name: 'GET_DOCUMENTS',
            },
          };

          //Формируем запрос на получение настроек для юзера
          const messageGetUserSettings: IMessage['body'] = {
            type: 'CMD',
            version: docVersion,
            payload: {
              name: 'GET_USER_SETTINGS',
            },
          };

          //Формируем запрос на получение настроек подсистемы
          const messageGetAppSettings: IMessage['body'] = {
            type: 'CMD',
            version: docVersion,
            payload: {
              name: 'GET_APP_SYSTEM_SETTINGS',
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

            addRequestNotice('Запрос справочников');

            //3. Отправляем запрос на получение справочников
            const sendMesRefResponse = await api.message.sendMessages(
              appSystem,
              messageCompany,
              consumer,
              messageGetRef,
              getNextOrder(),
              deviceId,
              authMiddleware,
            );

            if (sendMesRefResponse?.type === 'ERROR') {
              addErrorNotice(
                'useSync: api.message.sendMessages',
                `Запрос на получение справочников не отправлен: ${sendMesRefResponse.message}`,
              );
            }
          }

          addRequestNotice('Запрос документов');

          //4. Отправляем запрос на получение документов
          const sendMesDocRespone = await api.message.sendMessages(
            appSystem,
            messageCompany,
            consumer,
            messageGetDoc,
            getNextOrder(),
            deviceId,
            authMiddleware,
          );

          if (sendMesDocRespone.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.sendMessages',
              `Запрос на получение документов не отправлен: ${sendMesDocRespone.message}`,
            );
          }

          if (cleanDocTime > 0) {
            //5. Удаляем обработанные документы, которые хранятся больше времени, которое указано в настройках
            const maxDocDate = new Date();
            maxDocDate.setDate(maxDocDate.getDate() - cleanDocTime);

            const delDocs = documents
              .filter(
                (d) =>
                  (d.status === 'PROCESSED' || d.status === 'ARCHIVE') &&
                  new Date(d.documentDate).getTime() <= maxDocDate.getTime(),
              )
              .map((d) => d.id);

            if (delDocs.length) {
              addRequestNotice(`Удаление обработанных документов, дата которых менее ${getDateString(maxDocDate)}`);

              const delDocResponse = await docDispatch(documentActions.removeDocuments(delDocs));
              if (delDocResponse.type === 'DOCUMENTS/REMOVE_MANY_FAILURE') {
                addErrorNotice(
                  'useSync: removeDocuments',
                  `Обработанные документы, дата которых менее ${getDateString(maxDocDate)}, не удалены`,
                );
              }
            }
          }

          //5.1. Отправляем ошибки на сервер
          if (errorList.length) {
            // addRequestNotice('Отправка списка ошибок на сервер');
            //TODO: вызвать апи
            //5.2. Чистим старые ошибки
            const toDate = new Date();
            toDate.setDate(toDate.getDate() - (cleanDocTime || 7));
            const delErrors = errorList
              .filter((err) => new Date(err.date).getTime() < toDate.getTime())
              .map((err) => err.id);
            if (delErrors.length) {
              dispatch(appActions.removeErrors(delErrors));
            }
          }

          addRequestNotice('Запрос настроек пользователя');

          //7. Отправляем запрос на получение настроек пользователя
          const sendMesUserSettResponse = await api.message.sendMessages(
            appSystem,
            messageCompany,
            consumer,
            messageGetUserSettings,
            getNextOrder(),
            deviceId,
            authMiddleware,
          );

          if (sendMesUserSettResponse.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.sendMessages',
              `Запрос на получение настроек пользователя не отправлен: ${sendMesUserSettResponse.message}`,
            );
          }

          addRequestNotice('Запрос настроек подсистемы');

          //8. Отправляем запрос на получение настроек подсистемы
          const sendMesAppSettResponse = await api.message.sendMessages(
            appSystem,
            messageCompany,
            consumer,
            messageGetAppSettings,
            getNextOrder(),
            deviceId,
            authMiddleware,
          );

          if (sendMesAppSettResponse.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.sendMessages',
              `Запрос на получение настроек подсистемы не отправлен: ${sendMesAppSettResponse.message}`,
            );
          }
        } else if (onSync) {
          // Если передан внешний обработчик то вызываем
          await onSync();
        }
      } catch (err) {
        addErrorNotice('useSync', `Проблемы с передачей данных ${err}`);
      }

      if (!errorNotice.length) {
        dispatch(appActions.setSyncDate(new Date()));
      } else {
        dispatch(appActions.setShowSyncInfo(true));
      }

      dispatch(appActions.setLoading(false));
    };

    syncData();
  };

  const processMessage = async (msg: IMessage, params: { appSystemId: string; companyId: string }) => {
    if (!msg) {
      return;
    }

    //Если пришло сообщение, статус которого ошибка обработки, то добавляем ошибку с текстом из errorMessage
    if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
      addErrorNotice('useSync: processMessage', `Ошибка обработки сообщения id=${msg.id}: ${msg.errorMessage}`);
      return;
    }

    switch (msg.body.type as BodyType) {
      case 'CMD':
        //TODO: обработка
        break;

      case 'REFS': {
        //TODO: проверка данных, приведение к типу
        if ((msg.body.version || 1) !== refVersion) {
          addErrorNotice(
            'useSync: processMessage',
            `Структура загружаемых данных для справочников с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        const loadRefs = msg.body.payload as IReferences;

        addRequestNotice('Сохранение справочников');

        if (refLoadType) {
          //Записываем новые справочники из сообщения
          const setRefResponse = await refDispatch(referenceActions.setReferences(loadRefs));

          //Если удачно сохранились справочники, удаляем сообщение в json
          if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
            const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);
            if (removeMess.type === 'ERROR') {
              addErrorNotice(
                'useSync: api.message.removeMessage',
                `Справочники загружены, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
              );
            }
          } else if (setRefResponse.type === 'REFERENCES/SET_ALL_FAILURE') {
            addErrorNotice('useSync: setReferences', 'Справочники не загружены в хранилище');
          }
        } else {
          //Записываем новые справочники из сообщения
          const addRefResponse = await refDispatch(referenceActions.addReferences(loadRefs));

          //Если удачно сохранились справочники, удаляем сообщение в json
          if (addRefResponse.type === 'REFERENCES/ADD_SUCCESS') {
            const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);
            if (removeMess.type === 'ERROR') {
              addErrorNotice(
                'useSync: removeMessage',
                `Справочники добавлены, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
              );
            }
          } else if (addRefResponse.type === 'REFERENCES/ADD_FAILURE') {
            addErrorNotice('useSync: addReferences', 'Справочники не добавлены в хранилище');
          }
        }

        break;
      }

      case 'ONE_REF': {
        //TODO: проверка данных, приведение к типу
        if ((msg.body.version || 1) !== refVersion) {
          addErrorNotice(
            'useSync: processMessage',
            `Структура загружаемых данных для справочника с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        if (isIReferences(msg.body.payload)) {
          const loadRef = Object.entries(msg.body.payload);
          const [refName, refData] = loadRef[0];

          addRequestNotice(`Сохранение справочника ${refName}`);

          //Записываем новый справочник из сообщения
          const setRefResponse = await refDispatch(referenceActions.setOneReference({ refName, refData }));

          //Если удачно сохранился справочник, удаляем сообщение в json
          if (setRefResponse.type === 'REFERENCES/SET_ONE_SUCCESS') {
            const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);
            if (removeMess.type === 'ERROR') {
              addErrorNotice(
                'useSync: removeMessage',
                `Справочник ${refName} загружен, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
              );
            }
          } else if (setRefResponse.type === 'REFERENCES/SET_ONE_FAILURE') {
            addErrorNotice('useSync: setOneReference', `Справочник ${refName} не загружен в хранилище`);
          }
        } else {
          addErrorNotice('useSync', `Неверный тип данных объекта справочника в cообщении ${msg.id}`);
        }

        break;
      }

      case 'DOCS': {
        if ((msg.body.version || 1) !== docVersion) {
          addErrorNotice(
            'useSync: processMessage',
            `Структура загружаемых данных для документов с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        const removeMes = async () => {
          const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);
          if (removeMess.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.removeMessage',
              `Документы загружены, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
            );
          }
        };

        const loadDocs = msg.body.payload as IDocument[];

        if (!loadDocs.length) {
          removeMes();
          break;
        }

        addRequestNotice(`Сохранение документов (${loadDocs.length})`);

        const setDocResponse = await docDispatch(documentActions.setDocuments(loadDocs));

        //Если удачно сохранились документы, удаляем сообщение в json
        if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
          removeMes();
        } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
          addErrorNotice('useSync: setDocuments', 'Документы не загружены в хранилище');
        }

        break;
      }

      case 'SETTINGS': {
        //TODO: обработка
        if ((msg.body.version || 1) !== setVersion) {
          addErrorNotice(
            'useSync: processMessage',
            `Структура загружаемых данных для настроек пользователя с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        addRequestNotice('Сохранение настроек пользователя');

        const setUserSettingsResponse = await authDispatch(
          authActions.setUserSettings(msg.body.payload as IUserSettings),
        );

        //Если удачно сохранились настройки, удаляем сообщение в json
        if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_SUCCESS') {
          const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);

          if (removeMess.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.removeMessage',
              `Настройки пользователя загружены, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
            );
          }
        } else if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_FAILURE') {
          addErrorNotice('useSync: setUserSettings', 'Настройки пользователя не загружены в хранилище');
        }
        break;
      }

      case 'APP_SYSTEM_SETTINGS': {
        //TODO: обработка
        if ((msg.body.version || 1) !== setVersion) {
          addErrorNotice(
            'useSync: processMessage',
            `Структура загружаемых данных для настроек приложения с версией '${msg.body.version}' не поддерживается приложением`,
          );
          break;
        }

        try {
          addRequestNotice('Сохранение настроек подсистемы');

          const appSetts = Object.entries(msg.body.payload as IAppSystemSettings);
          for (const [optionName, value] of appSetts) {
            if (value && settings[optionName]) {
              settDispatch(
                settingsActions.updateOption({
                  optionName,
                  value: {
                    ...settings[optionName],
                    data: optionName === 'synchPeriod' ? ((value.data as number) || 600) / 60 : value.data,
                  } as ISettingsOption,
                }),
              );
            }
          }

          const removeMess = await api.message.removeMessage(msg.id, params, authMiddleware);
          if (removeMess.type === 'ERROR') {
            addErrorNotice(
              'useSync: api.message.removeMessage',
              `Настройки приложения загружены, но сообщение с id=${msg.id} на сервере не удалено: ${removeMess.message}`,
            );
          }
        } catch (err) {
          addErrorNotice('useSync', `Настройки приложения не загружены в хранилище: ${err}`);
        }
        break;
      }

      default:
        addErrorNotice('useSync: processMessage', `Команда ${msg.body.type} не поддерживается приложением`);
        break;
    }
  };

  return sync;
};
