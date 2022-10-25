/* eslint-disable max-len */
import { useDispatch, useSelector, appActions, authActions, useAuthThunkDispatch, referenceActions } from '@lib/store';

import { AuthLogOut, IMessage } from '@lib/types';
import api from '@lib/client-api';
import { Alert } from 'react-native';

import { getMessageParams, getNextOrder } from './helpers';

export const useSendRefsRequest = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());
  const { user, company, config } = useSelector((state) => state.auth);
  const refVersion = 1;
  const deviceId = config.deviceId!;

  return async () => {
    dispatch(referenceActions.setLoading(true));
    //Получаем параметры, необходимые для отправки сообщений
    const { params, errorMessage } = await getMessageParams({ user, company, authMiddleware });

    if (!params || errorMessage) {
      Alert.alert('Внимание!', `Запрос не может быть отправлен!\n${errorMessage}`, [{ text: 'OK' }]);
      dispatch(referenceActions.setLoading(false));
      return;
    }

    const messageCompany = { id: params?.company?.id, name: params?.company?.name };

    //Формируем запрос на получение справочников
    const messageGetRef: IMessage['body'] = {
      type: 'CMD',
      version: refVersion,
      payload: {
        name: 'GET_REF',
      },
    };

    //Отправляем запрос на получение справочников
    const sendMesRefResponse = await api.message.sendMessages(
      params.appSystem,
      messageCompany,
      params.consumer,
      messageGetRef,
      getNextOrder(),
      deviceId,
      authMiddleware,
    );

    if (sendMesRefResponse?.type === 'ERROR') {
      Alert.alert(
        'Внимание!',
        `Во время отправки запроса произошли ошибки:\n$Запрос на получение справочников не отправлен: ${sendMesRefResponse.message}`,
        [{ text: 'OK' }],
      );
    } else {
      Alert.alert('Внимание!', 'Запрос отправлен.\nСинхронизируйте данные через несколько минут.', [{ text: 'OK' }]);
      dispatch(appActions.setSyncDate(new Date()));
    }
    dispatch(referenceActions.setLoading(false));
  };
};
