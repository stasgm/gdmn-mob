/* eslint-disable max-len */
import { useDispatch, useSelector, appActions, authActions, useAuthThunkDispatch, referenceActions } from '@lib/store';

import { AuthLogOut, IMessage } from '@lib/types';
import api, { sleep } from '@lib/client-api';
import { Alert } from 'react-native';

import { generateId } from '../utils';

import { getNextOrder } from './helpers';

export const useSendRefsRequest = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());
  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const refVersion = 1;
  const deviceId = config.deviceId!;

  return async () => {
    dispatch(appActions.clearRequestNotice());

    if (!user || !company || !appSystem || !user.erpUser) {
      dispatch(
        appActions.addError({
          id: generateId(),
          date: new Date(),
          message: `useSendRefsRequest: Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
        }),
      );
      Alert.alert(
        'Внимание!',
        'Отправка запроса не может быть выпонена!\nПодробную информацию можно просмотреть в истории ошибок.',
        [{ text: 'OK' }],
      );

      return;
    }

    dispatch(appActions.setLoading(true));

    const messageCompany = { id: company.id, name: company.name };
    const consumer = user.erpUser;

    //Формируем запрос на получение справочников
    const messageGetRef: IMessage['body'] = {
      type: 'CMD',
      version: refVersion,
      payload: {
        name: 'GET_REF',
      },
    };

    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message: 'Отправка запроса на получение справочников',
      }),
    );

    //Отправляем запрос на получение справочников
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
      dispatch(
        appActions.addError({
          id: generateId(),
          date: new Date(),
          message: 'Получение подсистемы приложения',
        }),
      );
      Alert.alert(
        'Внимание!',
        'Запрос за справочниками не отправлен!\nПодробную информацию можно просмотреть в истории ошибок.',
        [{ text: 'OK' }],
      );
    } else {
      dispatch(appActions.setSyncDate(new Date()));
    }

    dispatch(appActions.setLoading(false));
  };
};
