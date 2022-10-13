import api from '@lib/client-api';
import { authActions, useAuthThunkDispatch, useSelector } from '@lib/store';
import { AuthLogOut, IAppSystem } from '@lib/types';
import { Alert } from 'react-native';

const useGetAppSystem = () => {
  const { user, company, config } = useSelector((state) => state.auth);
  const authDispatch = useAuthThunkDispatch();

  const authMiddleware: AuthLogOut = () => authDispatch(authActions.logout());

  return async () => {
    if (!user || !user.erpUser) {
      Alert.alert(
        'Внимание!',
        `Для ${user?.name} не указан пользователь ERP!\nПожалуйста, обратитесь к администратору.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (!company) {
      Alert.alert(
        'Внимание!',
        // eslint-disable-next-line max-len
        `Для пользователя ${user.name} не определена компания!\nПожалуйста, выполните выход из профиля и заново залогиньтесь под вашей учетной записью`,
        [{ text: 'OK' }],
      );
      return;
    }

    const consumer = user.erpUser;

    const getErpUser = await api.user.getUser(consumer.id, authMiddleware);

    let appSystem: IAppSystem | undefined;
    if (getErpUser.type === 'ERROR') {
      Alert.alert(
        'Внимание!',
        `Пользователь ERP не определен: ${getErpUser.message}!\nПожалуйста, обратитесь к администратору.`,
        [{ text: 'OK' }],
      );
    }

    if (getErpUser.type === 'GET_USER') {
      if (!getErpUser.user.appSystem) {
        Alert.alert(
          'Внимание!',
          'У пользователя ERP не установлена подсистема!\nПожалуйста, обратитесь к администратору.',
          [{ text: 'OK' }],
        );
      } else {
        return {company, appSystem: getErpUser.user.appSystem, };
      }
    }
    return appSystem;
  };
};

export default useGetAppSystem;
