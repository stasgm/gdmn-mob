/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  appActions,
  authActions,
  documentActions,
  referenceActions,
  settingsActions,
  useAuthThunkDispatch,
  useDispatch,
  useDocThunkDispatch,
  useRefThunkDispatch,
  useSelector,
  messageActions,
  useAppStore,
  IMultipartData,
  RootState,
  useSettingsThunkDispatch,
} from '@lib/store';

import api, { isConnectError } from '@lib/client-api';
import {
  BodyType,
  IDeviceLog,
  IDocument,
  IMessage,
  IReferences,
  ISettingsOption,
  IUserSettings,
  Settings,
} from '@lib/types';

import { useCallback, useMemo } from 'react';

import { generateId, getDateString, isIMessage, isIReferences, isNumeric } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { getNextOrder, MULTIPART_ITEM_LIVE_IN_MS, needRequest } from './helpers';
import { useSaveErrors } from './useSaveErrors';

export const useSync = (onSync?: () => Promise<any>) => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const settingsDispatch = useSettingsThunkDispatch();
  const dispatch = useDispatch();

  const addError = useCallback(
    (name: string, message: string, errs: IDeviceLog[], addErrorNotice = true) => {
      const err = {
        id: generateId(),
        name,
        date: new Date().toISOString(),
        message,
      };
      //Добавляем в список для отображения в окне процесса
      if (addErrorNotice) {
        dispatch(appActions.addErrorNotice(err));
      }
      errs.push(err);
    },
    [dispatch],
  );

  const addRequestNotice = useCallback(
    (message: string) => {
      dispatch(
        appActions.addRequestNotice({
          started: new Date(),
          message,
        }),
      );
    },
    [dispatch],
  );

  const { user, company, config, appSystem } = useSelector((state) => state.auth);

  const documents = useSelector((state) => state.documents.list);
  const settings = useSelector((state) => state.settings.data);

  const cleanDocTime = (settings.cleanDocTime as ISettingsOption<number>).data || 0;
  const refLoadType = (settings.refLoadType as ISettingsOption<boolean>).data;
  const isGetReferences = settings.getReferences?.data;
  const isGetRemains = settings.getRemains?.data;
  const autoSynchPeriod = (settings.autoSynchPeriod?.data as number) || 10;
  const deviceId = config.deviceId!;
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const store = useAppStore();

  const refVersion = 1;
  const docVersion = 1;
  const setVersion = 1;

  const { saveErrors } = useSaveErrors();

  const params = useMemo(
    () => (appSystem && company ? { appSystemId: appSystem?.id, companyId: company?.id } : undefined),
    [appSystem, company],
  );

  const processMessage = useCallback(
    async (msg: IMessage, tempErrs: IDeviceLog[], multipartId?: string) => {
      if (!msg || !params) {
        return;
      }

      if (!isIMessage(msg)) {
        addError(
          'useSync',
          `Неверная структура файла ${
            typeof msg === 'object' && 'id' in msg ? (msg as any).id : ''
          }. Обратитесь к администратору!`,
          tempErrs,
        );
        return;
      }

      //Если пришло сообщение, статус которого ошибка обработки, то добавляем ошибку с текстом из errorMessage
      if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
        addError('useSync: processMessage', `Сообщение id=${msg.id}: ${msg.errorMessage}`, tempErrs);
      }

      const removeMes = async (message: string) => {
        const removeMess = await api.message.removeMessage(appRequest, msg.id, params);
        if (removeMess.type !== 'REMOVE_MESSAGE') {
          addError('useSync: removeMessage', `${message} ${removeMess.message}`, tempErrs, false);
        } else {
          //Если ответ пришел, удаляем элемент с данным типом из массива запросов
          switch (msg.body.type) {
            case 'REFS': {
              dispatch(appActions.removeSyncRequest('GET_REF'));
              break;
            }
            case 'DOCS': {
              dispatch(appActions.removeSyncRequest('GET_DOCUMENTS'));
              break;
            }
            case 'APP_SYSTEM_SETTINGS': {
              dispatch(appActions.removeSyncRequest('GET_APP_SYSTEM_SETTINGS'));
              break;
            }
            case 'SETTINGS': {
              dispatch(appActions.removeSyncRequest('GET_USER_SETTINGS'));
              break;
            }
            case 'ONE_REF': {
              //GET_ONE_REF в syncRequest только для остатков, так как запрос остатков добавлен в синхронизацию.
              //Для других таблиц запрос можно слать вручную сколько угодно.
              if ((msg.body.payload as IReferences).remains) {
                dispatch(appActions.removeSyncRequest('GET_REMAINS'));
              }
              break;
            }
          }
        }
      };

      //Если часть сборного сообщения, то удаляем его файл
      if ('multipartId' in msg) {
        await removeMes(`Часть справочников сохранена, но сообщение с id=${msg.id} на сервере не удалено.`);
        return;
      }

      switch (msg.body.type as BodyType) {
        case 'CMD':
          //TODO: обработка
          return;

        case 'REFS': {
          //TODO: проверка данных, приведение к типу
          if ((msg.body.version || 1) !== refVersion) {
            addError(
              'useSync: processMessage',
              `Структура загружаемых данных для справочников с версией '${msg.body.version}' не поддерживается приложением`,
              tempErrs,
            );
            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Сообщение справочников с id=${msg.id} на сервере не удалено.`);
            break;
          }

          const loadRefs = msg.body.payload as IReferences;

          addRequestNotice('Сохранение справочников');

          if (refLoadType) {
            //Записываем новые справочники из сообщения
            const setRefResponse = await refDispatch(referenceActions.setReferences(loadRefs));

            //Если удачно сохранились справочники, удаляем сообщение в json
            if (setRefResponse.type === 'REFERENCES/SET_ALL_SUCCESS') {
              if (multipartId) {
                dispatch(messageActions.removeMultipartItem(multipartId));
              } else {
                await removeMes(`Справочники загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
              }
            } else if (setRefResponse.type === 'REFERENCES/SET_ALL_FAILURE') {
              addError('useSync: setReferences', 'Справочники не загружены в хранилище', tempErrs);
            }
          } else {
            //Записываем новые справочники из сообщения
            const addRefResponse = await refDispatch(referenceActions.addReferences(loadRefs));

            //Если удачно сохранились справочники, удаляем сообщение в json
            if (addRefResponse.type === 'REFERENCES/ADD_SUCCESS') {
              await removeMes(`Справочники загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
            } else if (addRefResponse.type === 'REFERENCES/ADD_FAILURE') {
              addError('useSync: addReferences', 'Справочники не добавлены в хранилище', tempErrs);
            }
          }

          break;
        }

        case 'ONE_REF': {
          //TODO: проверка данных, приведение к типу
          if ((msg.body.version || 1) !== refVersion) {
            addError(
              'useSync: processMessage',
              `Структура загружаемых данных для справочника с версией '${msg.body.version}' не поддерживается приложением`,
              tempErrs,
            );
            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Сообщение справочника с id=${msg.id} на сервере не удалено.`);
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
              if (multipartId) {
                dispatch(messageActions.removeMultipartItem(multipartId));
              } else {
                await removeMes(`Справочник загружен, но сообщение с id=${msg.id} на сервере не удалено.`);
              }
            } else if (setRefResponse.type === 'REFERENCES/SET_ONE_FAILURE') {
              addError('useSync: setOneReference', `Справочник ${refName} не загружен в хранилище`, tempErrs);
            }
          } else {
            addError('useSync', `Неверный тип данных объекта справочника в cообщении ${msg.id}`, tempErrs);
          }

          break;
        }

        case 'DOCS': {
          if ((msg.body.version || 1) !== docVersion) {
            addError(
              'useSync: processMessage',
              `Структура загружаемых данных для документов с версией '${msg.body.version}' не поддерживается приложением`,
              tempErrs,
            );
            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Сообщение документов с id=${msg.id} на сервере не удалено.`);
            break;
          }

          const loadDocs = msg.body.payload as IDocument[];

          if (!loadDocs.length) {
            await removeMes(`Сообщение документов с пустыми данными с id=${msg.id} на сервере не удалено.`);
          } else {
            addRequestNotice(`Сохранение документов (${loadDocs.length})`);

            const setDocResponse = await docDispatch(documentActions.setDocuments(loadDocs));

            //Если удачно сохранились документы, удаляем сообщение в json
            if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
              await removeMes(`Документы загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
            } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
              addError('useSync: setDocuments', 'Документы не загружены в хранилище', tempErrs);
            }
          }
          break;
        }

        case 'SETTINGS': {
          //TODO: обработка
          if ((msg.body.version || 1) !== setVersion) {
            addError(
              'useSync: processMessage',
              `Структура загружаемых данных для настроек пользователя с версией '${msg.body.version}' не поддерживается приложением`,
              tempErrs,
            );
            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Cообщение настроек пользователя с id=${msg.id} на сервере не удалено.`);
            break;
          }

          addRequestNotice('Сохранение настроек пользователя');

          const setUserSettingsResponse = await settingsDispatch(
            settingsActions.setUserSettings(msg.body.payload as IUserSettings),
          );

          //Если удачно сохранились настройки, удаляем сообщение в json
          if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_SUCCESS') {
            await removeMes(`Настройки пользователя загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
          } else if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_FAILURE') {
            addError('useSync: setUserSettings', 'Настройки пользователя не загружены в хранилище', tempErrs);
          }

          break;
        }

        case 'APP_SYSTEM_SETTINGS': {
          //TODO: обработка
          if ((msg.body.version || 1) !== setVersion) {
            addError(
              'useSync: processMessage',
              `Структура загружаемых данных для настроек приложения с версией '${msg.body.version}' не поддерживается приложением`,
              tempErrs,
            );
            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Cообщение настроек подсистемы с id=${msg.id} на сервере не удалено.`);
            break;
          }

          try {
            addRequestNotice('Сохранение настроек подсистемы');

            const appSetts = Object.entries(msg.body.payload as Settings);

            let syncPeriod;

            for (const [optionName, value] of appSetts) {
              if (value && settings[optionName]) {
                if (optionName === 'synchPeriod') {
                  syncPeriod = isNumeric(value.data) ? (Number(value.data) || 600) / 60 : undefined;

                  if (syncPeriod) {
                    dispatch(
                      settingsActions.updateOption({
                        optionName,
                        value: {
                          ...settings[optionName],
                          data: syncPeriod,
                        } as ISettingsOption,
                      }),
                    );
                  } else {
                    addError(
                      'useSync: processMessage',
                      'Неверный тип параметра "Период синхронизации на сервере" ',
                      tempErrs,
                    );
                  }
                } else {
                  dispatch(
                    settingsActions.updateOption({
                      optionName,
                      value: {
                        ...settings[optionName],
                        ...value,
                      } as ISettingsOption,
                    }),
                  );
                }
              }
            }

            if (autoSynchPeriod && syncPeriod && autoSynchPeriod < syncPeriod) {
              dispatch(
                settingsActions.updateOption({
                  optionName: 'autoSynchPeriod',
                  value: {
                    ...settings.autoSynchPeriod,
                    data: syncPeriod,
                  } as ISettingsOption,
                }),
              );
            }

            await removeMes(`Настройки подсистемы загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
          } catch (err) {
            addError('useSync', `Настройки приложения не загружены в хранилище: ${err}`, tempErrs);
          }
          break;
        }

        default:
          addError('useSync: processMessage', `Команда ${msg.body.type} не поддерживается приложением`, tempErrs);
      }
    },
    [
      addError,
      addRequestNotice,
      appRequest,
      autoSynchPeriod,
      dispatch,
      docDispatch,
      params,
      refDispatch,
      refLoadType,
      settings,
      settingsDispatch,
    ],
  );

  /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
  const syncData = async () => {
    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    const tempErrs: IDeviceLog[] = [];
    let connectError = false;

    try {
      if (!user || !company || !appSystem || !user.erpUser) {
        addError(
          'useSync',
          `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
          tempErrs,
        );
      } else {
        // Если нет функции из пропсов
        if (!onSync) {
          //Если статус приложения не проверен (не было сети при подключении) connectionStatus === 'not-checked'
          //то проверим его, и если статус не будет получен, прервем синхронизацию
          addRequestNotice('Проверка статуса устройства');

          const statusRespone = await api.auth.getDeviceStatus(appRequest, deviceId);
          if (statusRespone.type !== 'GET_DEVICE_STATUS') {
            addError('useSync: getDeviceStatus', `Статус устройства не получен. ${statusRespone.message}`, tempErrs);
            connectError = isConnectError(statusRespone.type);
          } else {
            authDispatch(
              authActions.setConnectionStatus(statusRespone.status === 'ACTIVE' ? 'connected' : 'not-activated'),
            );
          }

          if (!tempErrs.length) {
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
                appRequest,
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
                  addError(
                    'useSync: updateDocuments',
                    `Документы ${readyDocs.map((doc) => doc.number).join(', ')} отправлены, но статус не обновлен`,
                    tempErrs,
                  );
                }
              } else {
                addError(
                  'useSync: api.message.sendMessages',
                  `Документы ${readyDocs.map((doc) => doc.number).join(', ')} не отправлены. ${
                    sendMessageResponse.message
                  }`,
                  tempErrs,
                );
                connectError = isConnectError(sendMessageResponse.type);
              }
            }

            //Если до сих пор не было ошибки сети, то продолжаем
            if (!connectError) {
              addRequestNotice('Получение данных');
              //2. Получаем сообщения для мобильного
              let getMessagesResponse = await api.message.getMessages(appRequest, {
                appSystemId: appSystem.id,
                companyId: company.id,
              });
              //На случай зацикливания, count < 100
              let count = 0;

              //Если сообщения получены успешно, то
              //  справочники: очищаем старые и записываем в хранилище новые данные
              //  документы: добавляем новые, а старые заменяем, только если был статус 'DRAFT'
              //  отправляем запросы за остальными данными
              while (
                getMessagesResponse.type === 'GET_MESSAGES' &&
                getMessagesResponse.messageList.length > 0 &&
                count < 100
              ) {
                for (const message of getMessagesResponse.messageList) {
                  //Получая сообщение(я) у которого присутствует признак multipartId, помещаем его в хранилище
                  //Файл сообщения удаляем
                  if ('multipartId' in message) {
                    const addMultipartMessResponse = dispatch(messageActions.addMultipartMessage(message));
                    if (addMultipartMessResponse.type === 'MESSAGES/ADD_MULTIPART_MESSAGE') {
                      await processMessage(message, tempErrs);
                    }
                  } else {
                    await processMessage(message, tempErrs);
                  }
                }

                getMessagesResponse = await api.message.getMessages(appRequest, {
                  appSystemId: appSystem.id,
                  companyId: company.id,
                });
                count++;
              }

              const state = store.getState() as RootState;

              if (getMessagesResponse.type === 'GET_MESSAGES') {
                //Обрабатываем все сборные сообщения
                for (const [key, value] of Object.entries(state.messages.multipartData as IMultipartData)) {
                  //Если присутствуют идентификаторы последовательностей, с момента последнего сообщения в которых прошло более заданного промежутка (например, 1 час),
                  //то вся недопринятая последовательность удаляется, в лог помещается ошибка.
                  if (new Date().getTime() - new Date(value.lastLoadDate).getTime() > MULTIPART_ITEM_LIVE_IN_MS) {
                    dispatch(messageActions.removeMultipartItem(key));
                    addError(
                      'useSync: removeMultipartItem',
                      'Сборные справочники не загружены, не все файлы пришли вовремя',
                      tempErrs,
                    );
                  } else if (value.messages.find((m) => m.multipartEOF)) {
                    //Если получено сообщение, помеченное как последнее в последовательности
                    const sortedMessages = value.messages.sort((a, b) => a.multipartSeq - b.multipartSeq);
                    let isAll = true;
                    let c = 0;
                    for (; c < sortedMessages.length && isAll; c++) {
                      if (c + 1 !== sortedMessages[c].multipartSeq) {
                        isAll = false;
                      }
                    }
                    //Если в последовательности все номера,
                    //сообщения из последовательности сливается в одно большое сообщение (т.е. данные/массивы сливаются в один поток).
                    if (isAll) {
                      const newPayload = sortedMessages.reduce((prev: IReferences, cur) => {
                        for (const [refName, refData] of Object.entries(cur.body.payload as IReferences)) {
                          const data = prev[refName]?.data || [];
                          prev[refName] = prev[refName]
                            ? { ...prev[refName], data: [...data, ...refData.data] }
                            : refData;
                        }

                        return prev;
                      }, {});
                      //Данные для общего сообщения берем из первого сообщения
                      const firstMessage = sortedMessages[0];
                      const { multipartId, multipartSeq, multipartEOF, ...rest } = firstMessage;
                      const newMessage: IMessage = {
                        ...rest,
                        body: { ...firstMessage.body, payload: newPayload },
                      };

                      await processMessage(newMessage, tempErrs, multipartId);
                    } else {
                      //Если в последовательности пропущен хотя бы один номер,
                      //то вся последовательность удаляется из памяти, в лог заносится сообщение об ошибке.
                      dispatch(messageActions.removeMultipartItem(key));
                      addError(
                        'useSync: removeMultipartItem',
                        'Сборные справочники не загружены, пришли не все файлы',
                        tempErrs,
                      );
                    }
                  }
                }

                const currentDate = new Date();
                const syncRequests = state.app.syncRequests || [];

                if (isGetReferences && !connectError) {
                  //Если запрос такого типа не был отправлен или время запроса меньше текущего на час, то отправляем
                  if (needRequest(syncRequests, 'GET_REF', currentDate)) {
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
                      appRequest,
                      appSystem,
                      messageCompany,
                      consumer,
                      messageGetRef,
                      getNextOrder(),
                      deviceId,
                    );

                    if (sendMesRefResponse.type !== 'SEND_MESSAGE') {
                      addError(
                        'useSync: api.message.sendMessages',
                        `Запрос на получение справочников не отправлен. ${sendMesRefResponse.message}`,
                        tempErrs,
                      );
                      connectError = isConnectError(sendMesRefResponse.type);
                    }
                    if (sendMesRefResponse.type === 'SEND_MESSAGE') {
                      dispatch(appActions.addSyncRequest({ cmdName: 'GET_REF', date: currentDate }));
                    }
                  }
                }

                if (isGetRemains && !connectError) {
                  if (needRequest(syncRequests, 'GET_REMAINS', currentDate)) {
                    //Формируем запрос на получение справочников для следующего раза
                    const messageGetRef: IMessage['body'] = {
                      type: 'CMD',
                      version: refVersion,
                      payload: {
                        name: 'GET_ONE_REF',
                        params: { name: 'remains' },
                      },
                    };

                    addRequestNotice('Запрос остатков');

                    //3. Отправляем запрос на получение остатков
                    const sendMesRefResponse = await api.message.sendMessages(
                      appRequest,
                      appSystem,
                      messageCompany,
                      consumer,
                      messageGetRef,
                      getNextOrder(),
                      deviceId,
                    );

                    if (sendMesRefResponse.type !== 'SEND_MESSAGE') {
                      addError(
                        'useSync: api.message.sendMessages',
                        `Запрос на получение остатков не отправлен. ${sendMesRefResponse.message}`,
                        tempErrs,
                      );
                      connectError = isConnectError(sendMesRefResponse.type);
                    }
                    if (sendMesRefResponse.type === 'SEND_MESSAGE') {
                      dispatch(
                        appActions.addSyncRequest({
                          cmdName: 'GET_REMAINS',
                          date: currentDate,
                        }),
                      );
                    }
                  }
                }

                if (!connectError && needRequest(syncRequests, 'GET_DOCUMENTS', currentDate)) {
                  addRequestNotice('Запрос документов');

                  //Формируем запрос на получение документов для следующего раза
                  const messageGetDoc: IMessage['body'] = {
                    type: 'CMD',
                    version: docVersion,
                    payload: {
                      name: 'GET_DOCUMENTS',
                    },
                  };

                  //4. Отправляем запрос на получение документов
                  const sendMesDocRespone = await api.message.sendMessages(
                    appRequest,
                    appSystem,
                    messageCompany,
                    consumer,
                    messageGetDoc,
                    getNextOrder(),
                    deviceId,
                  );

                  if (sendMesDocRespone.type !== 'SEND_MESSAGE') {
                    addError(
                      'useSync: api.message.sendMessages',
                      `Запрос документов не отправлен. ${sendMesDocRespone.message}`,
                      tempErrs,
                    );
                    connectError = isConnectError(sendMesDocRespone.type);
                  }
                  if (sendMesDocRespone.type === 'SEND_MESSAGE') {
                    dispatch(appActions.addSyncRequest({ cmdName: 'GET_DOCUMENTS', date: currentDate }));
                  }
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
                    addRequestNotice(
                      `Удаление обработанных документов, дата которых менее ${getDateString(maxDocDate)}`,
                    );

                    const delDocResponse = await docDispatch(documentActions.removeDocuments(delDocs));
                    if (delDocResponse.type === 'DOCUMENTS/REMOVE_MANY_FAILURE') {
                      addError(
                        'useSync: removeDocuments',
                        `Обработанные документы, дата которых менее ${getDateString(maxDocDate)}, не удалены`,
                        tempErrs,
                      );
                    }
                  }
                }

                if (!connectError && needRequest(syncRequests, 'GET_USER_SETTINGS', currentDate)) {
                  addRequestNotice('Запрос настроек пользователя');

                  //Формируем запрос на получение настроек для юзера
                  const messageGetUserSettings: IMessage['body'] = {
                    type: 'CMD',
                    version: docVersion,
                    payload: {
                      name: 'GET_USER_SETTINGS',
                    },
                  };

                  //7. Отправляем запрос на получение настроек пользователя
                  const sendMesUserSettResponse = await api.message.sendMessages(
                    appRequest,
                    appSystem,
                    messageCompany,
                    consumer,
                    messageGetUserSettings,
                    getNextOrder(),
                    deviceId,
                  );

                  if (sendMesUserSettResponse.type !== 'SEND_MESSAGE') {
                    addError(
                      'useSync: api.message.sendMessages',
                      `Запрос на получение настроек пользователя не отправлен. ${sendMesUserSettResponse.message}`,
                      tempErrs,
                    );
                    connectError = isConnectError(sendMesUserSettResponse.type);
                  }
                  if (sendMesUserSettResponse.type === 'SEND_MESSAGE') {
                    dispatch(appActions.addSyncRequest({ cmdName: 'GET_USER_SETTINGS', date: currentDate }));
                  }
                }

                if (!connectError && needRequest(syncRequests, 'GET_APP_SYSTEM_SETTINGS', currentDate)) {
                  addRequestNotice('Запрос настроек подсистемы');

                  //Формируем запрос на получение настроек подсистемы
                  const messageGetAppSettings: IMessage['body'] = {
                    type: 'CMD',
                    version: docVersion,
                    payload: {
                      name: 'GET_APP_SYSTEM_SETTINGS',
                    },
                  };

                  //8. Отправляем запрос на получение настроек подсистемы
                  const sendMesAppSettResponse = await api.message.sendMessages(
                    appRequest,
                    appSystem,
                    messageCompany,
                    consumer,
                    messageGetAppSettings,
                    getNextOrder(),
                    deviceId,
                  );

                  if (sendMesAppSettResponse.type !== 'SEND_MESSAGE') {
                    addError(
                      'useSync: api.message.sendMessages',
                      `Запрос на получение настроек подсистемы не отправлен. ${sendMesAppSettResponse.message}`,
                      tempErrs,
                    );
                    connectError = isConnectError(sendMesAppSettResponse.type);
                  }
                  if (sendMesAppSettResponse.type === 'SEND_MESSAGE') {
                    dispatch(appActions.addSyncRequest({ cmdName: 'GET_APP_SYSTEM_SETTINGS', date: currentDate }));
                  }
                }
              } else {
                addError(
                  'useSync: api.message.getMessages',
                  `Сообщения не получены. ${getMessagesResponse.message}`,
                  tempErrs,
                );
                connectError = isConnectError(getMessagesResponse.type);
              }
            }
          }
        } else if (onSync) {
          // Если передан внешний обработчик то вызываем
          await onSync();
        }
      }
    } catch (err) {
      addError('useSync', `Проблемы с передачей данных ${err}`, tempErrs);
    }

    //Если не ошибка сети,
    //то сохраняем ошибки и передаем на сервер
    //иначе, сохраним их и передадим в следующий раз
    if (!connectError) {
      saveErrors(tempErrs);
    } else if (tempErrs.length) {
      dispatch(appActions.addErrors(tempErrs));
    }

    if (tempErrs.length) {
      dispatch(appActions.setShowSyncInfo(true));
    } else {
      dispatch(appActions.setSyncDate(new Date()));
    }

    dispatch(appActions.setLoading(false));
  };

  return { syncData };
};
