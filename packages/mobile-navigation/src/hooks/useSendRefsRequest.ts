/* eslint-disable max-len */
import {
  useDispatch,
  useDocThunkDispatch,
  useSelector,
  documentActions,
  appActions,
  authActions,
  useAuthThunkDispatch,
} from '@lib/store';

import { AuthLogOut, IAppSystem, IMessage } from '@lib/types';
import api from '@lib/client-api';
import { Alert } from 'react-native';

import { getNextOrder } from './orderCounter';



  const useSendRefsRequest = () => {
    const docDispatch = useDocThunkDispatch();
    const authDispatch = useAuthThunkDispatch();
    const dispatch = useDispatch();
    const refVersion = 1;

    const { user, company, config } = useSelector((state) => state.auth);

    const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());

    // return async () => {
    //   if (!user || !user.erpUser) {
    //     Alert.alert(
    //       'Внимание!',
    //       `Для ${user?.name} не указан пользователь ERP!\nПожалуйста, обратитесь к администратору.`,
    //       [{ text: 'OK' }],
    //     );
    //     return;
    //   }

    //   if (!company) {
    //     Alert.alert(
    //       'Внимание!',
    //       `Для пользователя ${user.name} не определена компания!\nПожалуйста, выполните выход из профиля и заново залогиньтесь под вашей учетной записью`,
    //       [{ text: 'OK' }],
    //     );
    //     return;
    //   }

    dispatch(documentActions.setLoading(true));
    dispatch(appActions.setErrorList([]));

    const errList: string[] = [];

    const consumer = user.erpUser;

    const deviceId = config.deviceId!;

    const getErpUser = await api.user.getUser(consumer.id, authMiddleware);

    let appSystem: IAppSystem | undefined;
    if (getErpUser.type === 'ERROR') {
      errList.push(`Пользователь ERP не определен: ${getErpUser.message}`);
    }

    if (getErpUser.type === 'GET_USER') {
      if (!getErpUser.user.appSystem) {
        errList.push('У пользователя ERP не установлена подсистема!\nПожалуйста, обратитесь к администратору.');
      } else {
        appSystem = getErpUser.user.appSystem;
      }
    }

    if (appSystem) {
      const messageCompany = { id: company.id, name: company.name };

      //Формируем запрос на получение справочников для следующего раза
      const messageGetRef: IMessage['body'] = {
        type: 'CMD',
        version: refVersion,
        payload: {
          name: 'GET_REF',
        },
      };

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
        errList.push(`Запрос на получение справочников не отправлен: ${sendMesRefResponse.message}`);
        // } else if (sendMesRefResponse.type === 'SEND_MESSAGE') {
        //   okList.push('Отправлен запрос на получение справочников');
      }
    }

    dispatch(documentActions.setLoading(false));
    dispatch(appActions.setErrorList(errList));

    if (errList?.length) {
      Alert.alert('Внимание!', `Во время отправки запроса произошли ошибки:\n${errList.join('\n')}`, [{ text: 'OK' }]);
    } else {
      Alert.alert('Внимание!', 'Запрос отправлен.\nСинхронизируйте данные через несколько минут.', [{ text: 'OK' }]);
      dispatch(appActions.setSyncDate(new Date()));
    }
  };
};

export default useSendRefsRequest;
