/* eslint-disable max-len */
import api from '@lib/client-api';
import { AuthLogOut, ICompany, INamedEntity, IUser } from '@lib/types';

let orderCounter = new Date().getTime();

export const getNextOrder = () => ++orderCounter;

export interface IMessageParams {
  params?: { company: INamedEntity; appSystem: INamedEntity; consumer: INamedEntity };
  errorMessage?: string;
}

export const getMessageParams = async ({
  user,
  company,
  authMiddleware,
}: {
  user?: IUser;
  company?: ICompany;
  authMiddleware?: AuthLogOut;
}): Promise<IMessageParams> => {
  if (!user || !user.erpUser) {
    return {
      errorMessage: `Для ${user?.name} не указан пользователь ERP!\nПожалуйста, обратитесь к администратору.`,
    };
  }
  console.log('company', company);
  if (!company) {
    return {
      errorMessage: `Для пользователя ${user.name} не определена компания!\nПожалуйста, выполните выход из профиля и заново залогиньтесь под вашей учетной записью.`,
    };
  }

  const consumer = user.erpUser;
  const getErpUser = await api.user.getUser(consumer.id, authMiddleware);

  if (getErpUser.type === 'GET_USER') {
    if (!getErpUser.user.appSystem) {
      return {
        errorMessage: 'У пользователя ERP не установлена подсистема!\nПожалуйста, обратитесь к администратору.',
      };
    } else {
      return { params: { company, appSystem: getErpUser.user.appSystem, consumer } };
    }
  } else {
    return {
      errorMessage: `Пользователь ERP не определен: ${getErpUser.message}!\nПожалуйста, обратитесь к администратору.`,
    };
  }
};
