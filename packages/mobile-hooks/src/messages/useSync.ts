/* eslint-disable no-await-in-loop */

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
  messageActions,
  IMultipartData,
  useSettingsThunkDispatch,
  useAppStore,
} from '@lib/store';

import api, { isConnectError } from '@lib/client-api';
import { BodyType, IDocument, IMessage, IReferences, ISettingsOption, IUserSettings, Settings } from '@lib/types';

import { useCallback, useMemo } from 'react';

import { addError, addRequestNotice, generateId, getRootState, isIMessage, isIReferences, isNumeric } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { useSendDeviceLog } from '../useSendDeviceLog';
import { useDeleteOldDocs } from '../useDeleteOldDocs';

import { useCheckDeviceStatus } from '../useCheckDeviceStatus';

import { getNextOrder, MULTIPART_ITEM_LIVE_IN_MS, needRequest } from './helpers';

export const useSync = (onSync?: () => Promise<any>) => {
  const docDispatch = useDocThunkDispatch();
  const refDispatch = useRefThunkDispatch();
  const authDispatch = useAuthThunkDispatch();
  const settingsDispatch = useSettingsThunkDispatch();
  const dispatch = useDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const store = useAppStore();
  const sendDeviceLog = useSendDeviceLog();
  const deleteOldDocs = useDeleteOldDocs();
  const checkDeviceStatus = useCheckDeviceStatus();

  const refVersion = 1;
  const docVersion = 1;
  const setVersion = 1;

  const processMessage = useCallback(
    async (msg: IMessage, processId: string, multipartId?: string) => {
      const { company, appSystem } = getRootState(store).auth;
      const settings = getRootState(store).settings.data;
      const refLoadType = (settings.refLoadType as ISettingsOption<boolean>).data;
      const autoSynchPeriod = (settings.autoSynchPeriod?.data as number) || 10;

      const params = appSystem && company ? { appSystemId: appSystem?.id, companyId: company?.id } : undefined;
      if (!msg || !params) {
        return;
      }

      if (!isIMessage(msg)) {
        addError(
          dispatch,
          'useSync',
          `Неверная структура файла ${
            typeof msg === 'object' && 'id' in msg ? (msg as any).id : ''
          }. Обратитесь к администратору!`,
          processId,
        );
        return;
      }

      //Если пришло сообщение, статус которого ошибка обработки, то добавляем ошибку с текстом из errorMessage
      if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
        addError(dispatch, 'useSync: processMessage', `Сообщение id=${msg.id}: ${msg.errorMessage}`, processId);
      }

      const removeMes = async (message: string) => {
        const removeMess = await api.message.removeMessage(appRequest, msg.id, params);
        if (removeMess.type !== 'REMOVE_MESSAGE') {
          addError(dispatch, 'useSync: removeMessage', `${message} ${removeMess.message}`, processId, false);
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
      }

      switch (msg.body.type as BodyType) {
        case 'CMD':
          //TODO: обработка
          return;

        case 'REFS': {
          //TODO: проверка данных, приведение к типу
          if ((msg.body.version || 1) !== refVersion) {
            addError(
              dispatch,
              'useSync: processMessage',
              `Структура загружаемых данных для справочников с версией '${msg.body.version}' не поддерживается приложением`,
              processId,
            );

            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Сообщение справочников с id=${msg.id} на сервере не удалено.`);
            break;
          }

          const loadRefs = msg.body.payload as IReferences;

          addRequestNotice(dispatch, 'Сохранение справочников');

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
              addError(dispatch, 'useSync: setReferences', 'Справочники не загружены в хранилище', processId);
            }
          } else {
            //Записываем новые справочники из сообщения
            const addRefResponse = await refDispatch(referenceActions.addReferences(loadRefs));

            //Если удачно сохранились справочники, удаляем сообщение в json
            if (addRefResponse.type === 'REFERENCES/ADD_SUCCESS') {
              await removeMes(`Справочники загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
            } else if (addRefResponse.type === 'REFERENCES/ADD_FAILURE') {
              addError(dispatch, 'useSync: addReferences', 'Справочники не добавлены в хранилище', processId);
            }
          }

          break;
        }

        case 'ONE_REF': {
          //TODO: проверка данных, приведение к типу
          if ((msg.body.version || 1) !== refVersion) {
            addError(
              dispatch,
              'useSync: processMessage',
              `Структура загружаемых данных для справочника с версией '${msg.body.version}' не поддерживается приложением`,
              processId,
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

            addRequestNotice(dispatch, `Сохранение справочника ${refName}`);

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
              addError(
                dispatch,
                'useSync: setOneReference',
                `Справочник ${refName} не загружен в хранилище`,
                processId,
              );
            }
          } else {
            addError(dispatch, 'useSync', `Неверный тип данных объекта справочника в cообщении ${msg.id}`, processId);
          }

          break;
        }

        case 'DOCS': {
          if ((msg.body.version || 1) !== docVersion) {
            addError(
              dispatch,
              'useSync: processMessage',
              `Структура загружаемых данных для документов с версией '${msg.body.version}' не поддерживается приложением`,
              processId,
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
            addRequestNotice(dispatch, `Сохранение документов (${loadDocs.length})`);

            const setDocResponse = await docDispatch(documentActions.setDocuments(loadDocs));

            //Если удачно сохранились документы, удаляем сообщение в json
            if (setDocResponse.type === 'DOCUMENTS/SET_ALL_SUCCESS') {
              await removeMes(`Документы загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
            } else if (setDocResponse.type === 'DOCUMENTS/SET_ALL_FAILURE') {
              addError(dispatch, 'useSync: setDocuments', 'Документы не загружены в хранилище', processId);
            }
          }
          break;
        }

        case 'SETTINGS': {
          //TODO: обработка
          if ((msg.body.version || 1) !== setVersion) {
            addError(
              dispatch,
              'useSync: processMessage',
              `Структура загружаемых данных для настроек пользователя с версией '${msg.body.version}' не поддерживается приложением`,
              processId,
            );

            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Cообщение настроек пользователя с id=${msg.id} на сервере не удалено.`);
            break;
          }

          addRequestNotice(dispatch, 'Сохранение настроек пользователя');

          const setUserSettingsResponse = await settingsDispatch(
            settingsActions.setUserSettings(msg.body.payload as IUserSettings),
          );

          //Если удачно сохранились настройки, удаляем сообщение в json
          if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_SUCCESS') {
            await removeMes(`Настройки пользователя загружены, но сообщение с id=${msg.id} на сервере не удалено.`);
          } else if (setUserSettingsResponse.type === 'AUTH/SET_USER_SETTINGS_FAILURE') {
            addError(
              dispatch,
              'useSync: setUserSettings',
              'Настройки пользователя не загружены в хранилище',
              processId,
            );
          }

          break;
        }

        case 'APP_SYSTEM_SETTINGS': {
          //TODO: обработка
          if ((msg.body.version || 1) !== setVersion) {
            addError(
              dispatch,
              'useSync: processMessage',
              `Структура загружаемых данных для настроек приложения с версией '${msg.body.version}' не поддерживается приложением`,
              processId,
            );

            break;
          }

          if (msg.status === 'PROCESSED_DEADLOCK' || msg.status === 'PROCESSED_INCORRECT') {
            await removeMes(`Cообщение настроек подсистемы с id=${msg.id} на сервере не удалено.`);
            break;
          }

          try {
            addRequestNotice(dispatch, 'Сохранение настроек подсистемы');

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
                      dispatch,
                      'useSync: processMessage',
                      'Неверный тип параметра "Период синхронизации на сервере" ',
                      processId,
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
            addError(dispatch, 'useSync', `Настройки приложения не загружены в хранилище: ${err}`, processId);
          }
          break;
        }

        default: {
          addError(
            dispatch,
            'useSync: processMessage',
            `Команда ${msg.body.type} не поддерживается приложением`,
            processId,
          );
        }
      }
    },
    [appRequest, dispatch, docDispatch, refDispatch, settingsDispatch, store],
  );

  /*
      Поддержка платформы:
      - загрузка сообщений
      - обработка сообщение
    */
  return useCallback(async () => {
    //Если идет процесс синхронизации, то выходим
    if (getRootState(store).app.loading) {
      return;
    }

    const { user, company, config, appSystem } = getRootState(store).auth;

    const documents = getRootState(store).documents.list;
    const settings = getRootState(store).settings.data;

    const isGetReferences = settings.getReferences?.data;
    const isGetRemains = settings.getRemains?.data;
    const deviceId = config.deviceId;

    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    let connectError = false;
    const processId = `useSync_${generateId()}`;

    try {
      if (!user || !company || !appSystem || !user.erpUser || !deviceId) {
        throw new Error(
          `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}, id устройства ${deviceId}`,
        );
      }

      // Если нет функции из пропсов
      if (!onSync) {
        //Если статус приложения не проверен (не было сети при подключении) connectionStatus === 'not-checked'
        //то проверим его, и если статус не будет получен, прервем синхронизацию
        addRequestNotice(dispatch, 'Проверка статуса устройства');
        await checkDeviceStatus();

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

          addRequestNotice(dispatch, 'Отправка документов на сервер');

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
            const sentDate = new Date().toISOString();
            const updateDocResponse = await docDispatch(
              documentActions.updateDocuments(readyDocs.map((d) => ({ ...d, status: 'SENT', sentDate }))),
            );

            if (updateDocResponse.type === 'DOCUMENTS/UPDATE_MANY_FAILURE') {
              addError(
                dispatch,
                'useSync: updateDocuments',
                `Документы ${readyDocs.map((doc) => doc.number).join(', ')} отправлены, но статус не обновлен`,
                processId,
              );
            }
          } else {
            addError(
              dispatch,
              'useSync: api.message.sendMessages',
              `Документы ${readyDocs.map((doc) => doc.number).join(', ')} не отправлены. ${
                (sendMessageResponse.message, processId)
              }`,
            );
            connectError = isConnectError(sendMessageResponse.type);
          }
        }

        if (!connectError) {
          addRequestNotice(dispatch, 'Получение данных');
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
                  await processMessage(message, processId);
                }
              } else {
                await processMessage(message, processId);
              }
            }

            getMessagesResponse = await api.message.getMessages(appRequest, {
              appSystemId: appSystem.id,
              companyId: company.id,
            });
            count++;
          }

          if (getMessagesResponse.type === 'GET_MESSAGES') {
            //Обрабатываем все сборные сообщения
            for (const [key, value] of Object.entries(getRootState(store).messages.multipartData as IMultipartData)) {
              //Если присутствуют идентификаторы последовательностей, с момента последнего сообщения в которых прошло более заданного промежутка (например, 1 час),
              //то вся недопринятая последовательность удаляется, в лог помещается ошибка.
              if (new Date().getTime() - new Date(value.lastLoadDate).getTime() > MULTIPART_ITEM_LIVE_IN_MS) {
                dispatch(messageActions.removeMultipartItem(key));

                addError(
                  dispatch,
                  'useSync: removeMultipartItem',
                  'Сборные справочники не загружены, не все файлы пришли вовремя',
                  processId,
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
                      prev[refName] = prev[refName] ? { ...prev[refName], data: [...data, ...refData.data] } : refData;
                    }

                    return prev;
                  }, {});
                  //Данные для общего сообщения берем из первого сообщения
                  const firstMessage = sortedMessages[0];
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { multipartId, multipartSeq, multipartEOF, ...rest } = firstMessage;
                  const newMessage: IMessage = {
                    ...rest,
                    body: { ...firstMessage.body, payload: newPayload },
                  };

                  await processMessage(newMessage, multipartId);
                } else {
                  //Если в последовательности пропущен хотя бы один номер,
                  //то вся последовательность удаляется из памяти, в лог заносится сообщение об ошибке.
                  dispatch(messageActions.removeMultipartItem(key));
                  addError(
                    dispatch,
                    'useSync: removeMultipartItem',
                    'Сборные справочники не загружены, пришли не все файлы',
                    processId,
                  );
                }
              }
            }

            const currentDate = new Date();
            const syncRequests = getRootState(store).app.syncRequests || [];

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

                addRequestNotice(dispatch, 'Запрос справочников');

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
                    dispatch,
                    'useSync: api.message.sendMessages',
                    `Запрос на получение справочников не отправлен. ${sendMesRefResponse.message}`,
                    processId,
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

                addRequestNotice(dispatch, 'Запрос остатков');

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
                    dispatch,
                    'useSync: api.message.sendMessages',
                    `Запрос на получение остатков не отправлен. ${sendMesRefResponse.message}`,
                    processId,
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
              addRequestNotice(dispatch, 'Запрос документов');

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
                  dispatch,
                  'useSync: api.message.sendMessages',
                  `Запрос документов не отправлен. ${sendMesDocRespone.message}`,
                  processId,
                );
                connectError = isConnectError(sendMesDocRespone.type);
              }
              if (sendMesDocRespone.type === 'SEND_MESSAGE') {
                dispatch(appActions.addSyncRequest({ cmdName: 'GET_DOCUMENTS', date: currentDate }));
              }
            }

            if (!connectError && needRequest(syncRequests, 'GET_USER_SETTINGS', currentDate)) {
              addRequestNotice(dispatch, 'Запрос настроек пользователя');

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
                  dispatch,
                  'useSync: api.message.sendMessages',
                  `Запрос на получение настроек пользователя не отправлен. ${sendMesUserSettResponse.message}`,
                  processId,
                );
                connectError = isConnectError(sendMesUserSettResponse.type);
              }
              if (sendMesUserSettResponse.type === 'SEND_MESSAGE') {
                dispatch(appActions.addSyncRequest({ cmdName: 'GET_USER_SETTINGS', date: currentDate }));
              }
            }

            if (!connectError && needRequest(syncRequests, 'GET_APP_SYSTEM_SETTINGS', currentDate)) {
              addRequestNotice(dispatch, 'Запрос настроек подсистемы');

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
                  dispatch,
                  'useSync: api.message.sendMessages',
                  `Запрос на получение настроек подсистемы не отправлен. ${sendMesAppSettResponse.message}`,
                  processId,
                );
                connectError = isConnectError(sendMesAppSettResponse.type);
              }
              if (sendMesAppSettResponse.type === 'SEND_MESSAGE') {
                dispatch(appActions.addSyncRequest({ cmdName: 'GET_APP_SYSTEM_SETTINGS', date: currentDate }));
              }
            }
          } else {
            addError(
              dispatch,
              'useSync: api.message.getMessages',
              `Сообщения не получены. ${getMessagesResponse.message}`,
              processId,
            );
            connectError = isConnectError(getMessagesResponse.type);
          }
        }
      } else if (onSync) {
        // Если передан внешний обработчик то вызываем
        await onSync();
      }

      await sendDeviceLog();
      await deleteOldDocs();
    } catch (err) {
      addError(dispatch, 'useSync', `Проблемы с передачей данных ${err}`, processId);
    } finally {
      //Если были ошибки, показываем в окне процесса
      if (getRootState(store).app.errorLog.filter((e) => e.processId === processId).length > 0) {
        dispatch(appActions.setShowSyncInfo(true));
      } else {
        dispatch(appActions.setSyncDate(new Date()));
      }

      dispatch(appActions.setLoading(false));
    }
  }, [
    appRequest,
    checkDeviceStatus,
    deleteOldDocs,
    dispatch,
    docDispatch,
    onSync,
    processMessage,
    sendDeviceLog,
    store,
  ]);
};
