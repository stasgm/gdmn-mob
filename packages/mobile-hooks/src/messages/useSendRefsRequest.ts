import { useDispatch, useSelector, appActions, authActions, useAuthThunkDispatch } from '@lib/store';

import { AuthLogOut, IMessage } from '@lib/types';
import api from '@lib/client-api';

import { generateId } from '../utils';

import { getNextOrder } from './helpers';
import { useSaveErrors } from './useSaveErrors';

export const useSendRefsRequest = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());

  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const refVersion = 1;
  let withError = false;
  const deviceId = config.deviceId!;
  const { saveErrors } = useSaveErrors();

  const addRequestNotice = (message: string) => {
    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message,
      }),
    );
  };

  const addError = (name: string, message: string) => {
    const err = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      message,
    };
    dispatch(appActions.addErrorNotice(err));
    dispatch(appActions.addError(err));
    withError = true;
  };

  return async () => {
    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    addRequestNotice('Запрос на получение справочников');

    if (!user || !company || !appSystem || !user.erpUser) {
      addError(
        'useSendRefsRequest',
        // eslint-disable-next-line max-len
        `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
      );
    } else {
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
        addError('useSendRefsRequest: api.message.sendMessages', sendMesRefResponse.message);
      }
    }
    if (withError) {
      dispatch(appActions.setShowSyncInfo(true));
    }

    saveErrors();

    dispatch(appActions.setLoading(false));
  };
};
