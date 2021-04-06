/* eslint-disable prettier/prettier */
import { useReducer, useCallback, useEffect } from 'react';

import { IUser, ICompany, IDevice } from '@lib/types';
import { requests } from '@lib/client-api';

import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Menu } from './components/Menu';
import { AdminBox } from './components/AdminBox';
import { SignUp } from './components/SignUp';
import { CompanyBox } from './components/CompanyBox';
import { Company } from './components/Company';
import { Device } from './components/Device';
import { User } from './components/User';
import { ModalBox } from './components/ModalBox';
import { SystemUser } from './components/SystemUser';

type AppState =
  | 'LOGIN'
  | 'QUERY_LOGIN'
  | 'QUERY_LOGOUT'
  | 'SIGNUP'
  | 'SIGNUP_CODE'
  | 'QUERY_SIGNUP'
  | 'PROFILE'
  | 'SAVED_PROFILE'
  | 'ADMIN'
  | 'CREATE_COMPANY'
  | 'UPDATE_COMPANY'
  | 'CREATE_USER'
  | 'ADD_USER_FROM_SYSTEM'
  | 'SHOW_CODE'
  | 'SHOW_CURRENT_CODE'
  | 'UPDATE_USER'
  | 'CREATE_DEVICENAME'
  | 'CREATE_CURRENT_DEVICENAME';

interface IState {
  /**
   * Состояние нашего приложения. В зависимости
   * от него мы будем отрисовывать экран.
   */
  appState: AppState;
  /**
   * Наличие данных о пользователе будет для
   * нас сигналом, что успешно прошла авторизация
   * на сервере.
   */
  user?: IUser;

  activationCode?: string;
  company?: ICompany;
  companies?: ICompany[];
  devices?: IDevice[];
  currentUser?: IUser;
  currentCompanies?: ICompany[];
  currentDevices?: IDevice[];
  companyUsers?: IUser[];
  allUsers?: IUser[];
  errorMessage?: string;
  isAdmin?: boolean;
  needReReadCompanies?: boolean;
  needReReadUsers?: boolean;
  needReReadUserData?: boolean;
}

type Action =
  | { type: 'SET_STATE'; appState: AppState }
  | { type: 'SET_USER'; user?: IUser; needReReadCompanies?: boolean; needReReadUserData?: boolean }
  | { type: 'UPDATE_USER'; user: Partial<IUser> }
  | { type: 'LOGOUT' }
  | { type: 'SET_ACTIVATION_CODE'; code?: string }
  | { type: 'SET_COMPANY_USERS'; companyUsers?: IUser[] }
  | { type: 'SET_ALL_USERS'; allUsers?: IUser[] }
  | { type: 'CREATE_COMPANY'; company: ICompany }
  | { type: 'SET_COMPANY'; company?: ICompany; needReReadUsers?: boolean }
  | { type: 'SET_COMPANIES'; companies?: ICompany[] }
  | { type: 'SET_CURRENT_COMPANIES'; companies?: ICompany[] }
  | { type: 'SET_CURRENT_USER'; user?: IUser }
  | { type: 'UPDATE_CURRENT_USER'; user: Partial<IUser> }
  | { type: 'SET_IS_ADMIN'; isAdmin?: boolean }
  | { type: 'UPDATE_COMPANY'; companyId: string; companyName: string }
  | { type: 'SET_DEVICES'; devices?: IDevice[] }
  | { type: 'SET_CURRENT_DEVICES'; devices?: IDevice[] }
  | { type: 'UPDATE_CURRENT_DEVICE'; device: IDevice }
  | { type: 'DELETE_CURRENT_DEVICE'; id: string }
  | { type: 'SET_ERROR'; errorMessage?: string };

/*

    Когда нам надо с сервера получать список организаций?

    1. Сразу после успешного логина. Получаем список и храним его в стэйте App.
       Используем этот список при отрисовке на экране и прочих действиях.

    2. При переходе на страницу просмотр профиля мы перечитываем список организаций
       на случай, если он поменялся где-то еще (например, с другого компьютера).

    3. При переходе на страницу Администратор (там есть раздел мои организации).

    Все вышеперечисленные случаи обрабатываются в редусере и устанавливается
    соответстувующий флаг needReReadCompanies.

*/

/*
  Получить данные по пользователю надо:
  1. При открытии приложения, если раньше был совершен вход
  2. Если был совершен выход (user === undefined) и пользователь логинится
*/

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case 'SET_STATE': {
      return {
        ...state,
        appState: action.appState,
        //  needReReadCompanies: state.needReReadCompanies || (state.appState
        //!== action.appState && (action.appState === 'LOGIN' ))
      };
    }
    case 'SET_ERROR': {
      const { errorMessage } = action;
      return {
        ...state,
        errorMessage,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        company: undefined,
        user: undefined,
        isAdmin: undefined,
        appState: 'LOGIN',
      };
    }
    case 'SET_USER': {
      const { user, needReReadCompanies, needReReadUserData } = action;
      return {
        ...state,
        user,
        needReReadCompanies,
        needReReadUserData,
        currentUser: undefined,
      };
    }
    case 'UPDATE_USER': {
      const { user } = action;
      return {
        ...state,
        user: state.user ? { ...state.user, ...user } : undefined,
      };
    }
    case 'SET_ACTIVATION_CODE': {
      return {
        ...state,
        activationCode: action.code,
      };
    }
    case 'SET_COMPANY_USERS': {
      const { companyUsers } = action;
      return {
        ...state,
        companyUsers,
      };
    }
    case 'SET_ALL_USERS': {
      const { allUsers } = action;
      return {
        ...state,
        allUsers,
      };
    }
    case 'CREATE_COMPANY': {
      const { company } = action;
      return {
        ...state,
        companies: state.companies ? [...state.companies, company] : [company],
      };
    }
    case 'UPDATE_COMPANY': {
      const { companyId, companyName } = action;
      return {
        ...state,
        companies: state.companies?.map((comp) => (comp.id === companyId ? { ...comp, companyName } : comp)),
      };
    }
    case 'SET_COMPANIES': {
      /**
       * При загрузке списка компаний, мы проверяем есть ли среди них
       * хотя бы одна, для которой текущий пользователь является администратором
       * и выставляем соответствующий флаг в стэйте.
       */

      const { companies } = action;
      const isAdmin = companies?.some((c) => c.admin === (state.user?.id || ''));
      return {
        ...state,
        companies,
        needReReadCompanies: false,
        isAdmin,
      };
    }
    case 'SET_CURRENT_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        currentCompanies: companies,
      };
    }
    case 'SET_COMPANY': {
      const { company, needReReadUsers } = action;
      return {
        ...state,
        company,
        needReReadUsers,
      };
    }
    case 'SET_CURRENT_USER': {
      const { user } = action;
      return {
        ...state,
        currentUser: user,
      };
    }
    case 'UPDATE_CURRENT_USER': {
      const { user } = action;
      return {
        ...state,
        currentUser: state.currentUser ? { ...state.currentUser, ...user } : undefined,
      };
    }

    case 'SET_IS_ADMIN': {
      const { isAdmin } = action;
      return {
        ...state,
        isAdmin,
      };
    }

    case 'SET_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        devices,
      };
    }

    case 'SET_CURRENT_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        currentDevices: devices,
      };
    }

    case 'UPDATE_CURRENT_DEVICE': {
      const { device } = action;
      const { currentDevices } = state;
      const idx = currentDevices?.findIndex((item) => item.id === device.id);
      if (currentDevices && idx !== undefined && idx > -1) {
        return {
          ...state,
          currentDevices: [...currentDevices?.slice(0, idx), device, ...currentDevices?.slice(idx + 1)],
        };
      } else {
        return state;
      }
    }

    case 'DELETE_CURRENT_DEVICE': {
      const { id } = action;
      const { currentDevices } = state;
      if (currentDevices) {
        return {
          ...state,
          currentDevices: currentDevices.filter((item) => item.id !== id),
        };
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

const App = () => {
  const [
    {
      appState,
      user,
      activationCode,
      companies,
      currentCompanies,
      company,
      companyUsers,
      allUsers,
      errorMessage,
      isAdmin,
      currentUser,
      devices,
      currentDevices,
      needReReadCompanies,
      needReReadUsers,
      needReReadUserData,
    },
    dispatch,
  ] = useReducer(reducer, {
    appState: 'LOGIN',
    needReReadUserData: true,
  });

  const handleSetError = useCallback(
    (errMessage?: string) => {
      dispatch({ type: 'SET_ERROR', errorMessage: errMessage });
    },
    [dispatch],
  );

  const handleSetAppState = useCallback(
    (state: AppState) => {
      dispatch({ type: 'SET_STATE', appState: state });
    },
    [dispatch],
  );

  const handleLogin = async (userName: string, password: string) => {
    console.log('handleLogin');
    const data = await requests.auth.login({ userName, password });
    if (data.type === 'ERROR') {
      dispatch({ type: 'SET_ERROR', errorMessage: data.message });
    } else if (data.type === 'LOGIN') {
      dispatch({ type: 'SET_USER', needReReadUserData: true });
    }
  };

  const handleSignUp = async (userName: string, password: string) => {
    const data = await requests.auth.signup(userName, password);
    if (data.type === 'ERROR') {
      dispatch({ type: 'SET_ERROR', errorMessage: data.message });
    } else if (data.type === 'SIGNUP') {
      //dispatch({ type: 'SET_USER', user: data.user });
      dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
    }
  };

  const handleLogOut = async () => {
    const data = await requests.auth.logout();
    if (data.type === 'ERROR') {
      dispatch({ type: 'SET_ERROR', errorMessage: data.message });
    } else if (data.type === 'LOGOUT') {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const handleGetAllUsers = async () => {
    const data = await requests.user.getUsers();
    if (data.type === 'ERROR') {
      dispatch({ type: 'SET_ERROR', errorMessage: data.message });
    } else if (data.type === 'GET_USERS') {
      dispatch({ type: 'SET_ALL_USERS', allUsers: data.users.filter((u) => u.id !== user?.id) });
      dispatch({ type: 'SET_STATE', appState: 'ADD_USER_FROM_SYSTEM' });
    }
  };

  const handleCreateCode = async (deviceId: string) => {
    if (deviceId) {
      const data = await requests.auth.getActivationCode();

      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'GET_CODE') {
        dispatch({ type: 'SET_ACTIVATION_CODE', code: data.code });
        dispatch({
          type: 'SET_DEVICES',
          devices: devices?.map((d) => (d.id === deviceId ? { ...d, state: d.state } : { ...d })),
        });
        dispatch({ type: 'SET_STATE', appState: 'SHOW_CODE' });
      }
    }
  };

  const handleCreateCurrentCode = async (deviceId: string) => {
    if (deviceId) {
      const data = await requests.auth.getActivationCode();
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'GET_CODE') {
        dispatch({ type: 'SET_ACTIVATION_CODE', code: data.code });
        dispatch({
          type: 'SET_CURRENT_DEVICES',
          devices: currentDevices?.map((d) => (d.id === deviceId ? { ...d, state: 'NON-ACTIVATED' } : { ...d })),
        });
        dispatch({ type: 'SET_STATE', appState: 'SHOW_CURRENT_CODE' });
      }
    }
  };

  const handleCreateDevice = async (title: string) => {
    console.log('handleCreateDevice.user: ', user);
    if (user?.id) {
      const data = await requests.device.addDevice(title, user.id);
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'ADD_DEVICE') {
        dispatch({
          type: 'SET_DEVICES',
          devices: [
            ...(devices || []),
            {
              id: data.id,
              uid: '',
              name: title,
              userId: user.id ?? '',
              // userName: user.userName,
              state: 'NEW',
            },
          ],
        });
        dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
      }
    }

    const handleCreateCurrentDevice = async (title: string) => {
      console.log('handleCreateCurrentDevice.currentUser: ', currentUser);
      if (currentUser?.id) {
        const data = await requests.device.addDevice(title, currentUser.id);
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        } else if (data.type === 'ADD_DEVICE') {
          dispatch({
            type: 'SET_CURRENT_DEVICES',
            devices: [
              ...(currentDevices || []),
              {
                id: data.id,
                uid: '',
                name: title,
                userId: currentUser.id ?? '',
                state: 'NEW',
              },
            ],
          });
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
        }
      }
    };

    const handleSelectCompany = async (companyId: string) => {
      const data = await requests.company.getCompany(companyId);
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'GET_COMPANY') {
        dispatch({ type: 'SET_COMPANY', company: data.company, needReReadUsers: true });
        dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
      }
    };

    const handleCreateCompany = async (companyName: string) => {
      if (user?.id) {
        const data = await requests.company.addCompany(companyName, '1');
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        } else if (data.type === 'ADD_COMPANY') {
          const newCompany: ICompany = { title: companyName, id: data.companyId, admin: user.id || '' };
          dispatch({ type: 'SET_COMPANY', company: newCompany });
          dispatch({
            type: 'SET_COMPANIES',
            companies: (companies ? [...companies, newCompany] : [newCompany]).filter((c) => c.admin === user.id),
          });
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: true });
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        }
      }
    };

    const handleCreateUser = async (new_user: IUser) => {
      if (company?.id && user?.id) {
        const data = await requests.auth.signup(new_user.userName, new_user.password ?? '', company.id, user.id);
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        } else if (data.type === 'SIGNUP') {
          //dispatch({ type: 'SET_CURRENT_USER', user: data.user });
          dispatch({
            type: 'SET_COMPANY_USERS',
            companyUsers: companyUsers
              ? [...companyUsers, { ...new_user, id: data.userId }]
              : [{ ...new_user, id: data.userId }],
          });
          dispatch({ type: 'SET_CURRENT_DEVICES', devices: [] });
          dispatch({ type: 'SET_COMPANIES', companies: companies?.filter((c) => c.id === company.id) });
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
        }
      }
    };

    const handleAddSystemUser = async (userId: string) => {
      const systemUser = allUsers?.find((item) => item.id === userId);
      if (company?.id && systemUser) {
        const data = await requests.user.updateUser({
          ...systemUser,
          companies: systemUser.companies ? [...systemUser.companies, company?.id] : [company?.id],
        });
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        } else if (data.type === 'UPDATE_USER') {
          const addedUser = allUsers?.find((u) => u.id === userId);
          if (addedUser) {
            dispatch({ type: 'SET_CURRENT_USER', user: { ...addedUser } });
            dispatch({
              type: 'SET_COMPANY_USERS',
              companyUsers: companyUsers ? [...companyUsers, addedUser] : [addedUser],
            });
            dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
          }
        }
      }
    };

    const handleUpdateCompany = async (companyId: string, companyName: string) => {
      const company = {
        id: companyId,
        externalId: '1',
        title: companyName,
        admin: user?.id,
      };
      const data = await requests.company.updateCompany(company);
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'UPDATE_COMPANY') {
        dispatch({ type: 'UPDATE_COMPANY', companyId, companyName });
        dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
      }
    };

    const handleGetCompanies = async (
      comps: string[],
      userId: string,
      type: 'SET_COMPANIES' | 'SET_CURRENT_COMPANIES',
    ) => {
      const data = await requests.company.getCompanies();
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'GET_COMPANIES') {
        const getCompanies = data.companies
          .filter((item) => comps.some((c) => c === item.id))
          .map((item) => {
            return ({
              companyId: item.id,
              companyName: item.title,
              userRole: item.admin === userId ? 'Admin' : undefined,
            } as unknown) as ICompany;
          });
        dispatch({ type: type, companies: getCompanies });
      }
    };

    const handleGetUserDevices = async (userId: string, type: 'SET_DEVICES' | 'SET_CURRENT_DEVICES') => {
      const data = await requests.device.getDevices(userId);
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'GET_DEVICES') {
        dispatch({ type, devices: data.devices });
      }
    };

    const handleUpdateUser = async (editUser: Partial<IUser>, type: 'UPDATE_USER' | 'UPDATE_CURRENT_USER') => {
      const data = await requests.user.updateUser(editUser);
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      } else if (data.type === 'UPDATE_USER') {
        dispatch({ type, user: editUser });
        dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
      }
    };

    const handleRemoveCompanyUsers = (userIds: string[]) => {
      if (company?.id) {
        const uIds = userIds.filter((u) => u !== user?.id);
        uIds.forEach(async (uId) => {
          const data = await requests.user.getUser(uId);

          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          } else if (data.type === 'GET_USER') {
            if (data.user && data.user.companies) {
              const dataUpdate = await requests.user.updateUser({
                ...data.user,
                companies: data.user.companies.filter((item) => item !== company?.id),
              });
              if (dataUpdate?.type === 'ERROR') {
                dispatch({ type: 'SET_ERROR', errorMessage: dataUpdate.message });
              } else if (dataUpdate?.type === 'UPDATE_USER') {
                dispatch({ type: 'SET_USER', user });
                dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
              }
            }
          }
        });
      }
    };

    const handleRemoveDevices = (deviceIds: string[]) => {
      deviceIds.forEach(async (dId) => {
        if (user && user.id) {
          const data = await requests.device.removeDevice(dId);
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          } else if (data.type === 'REMOVE_DEVICE') {
            const newDevices = devices?.filter((c) => dId !== c.id);
            dispatch({ type: 'SET_DEVICES', devices: newDevices });
          }
        }
      });
    };

    const handleBlockDevices = (deviceIds: string[], isUnBlock: boolean) => {
      if (user?.id) {
        deviceIds.forEach(async (dId) => {
          const data = await requests.device.updateDevice({ id: dId, state: !isUnBlock ? 'BLOCKED' : 'ACTIVE' });

          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          } else if (data.type === 'UPDATE_DEVICE') {
            const newDevices: IDevice[] | undefined = devices?.map((dev) =>
              dev.id === data.deviceId ? { ...dev, state: isUnBlock ? 'ACTIVE' : 'BLOCKED' } : dev,
            );
            dispatch({ type: 'SET_DEVICES', devices: newDevices });
          }
        });
      }
    };

    const handleRemoveCurrentDevices = (deviceIds: string[]) => {
      if (currentUser?.id) {
        deviceIds.forEach(async (dId) => {
          const data = await requests.device.removeDevice(dId);
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          } else if (data.type === 'REMOVE_DEVICE') {
            dispatch({ type: 'DELETE_CURRENT_DEVICE', id: dId });
            const newDevices = currentDevices?.filter((c) => dId !== c.id);
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: newDevices });
          }
        });
      }
    };

    const handleBlockCurrentDevices = (deviceIds: string[], isUnBlock: boolean) => {
      if (currentUser?.id) {
        deviceIds.forEach(async (dId) => {
          const data = await requests.device.updateDevice({ id: dId, state: isUnBlock ? 'ACTIVE' : 'BLOCKED' });

          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          } else if (data.type === 'UPDATE_DEVICE') {
            const newDevices: IDevice[] | undefined = currentDevices?.map((dev) =>
              dev.id === data.deviceId ? { ...dev, state: isUnBlock ? 'ACTIVE' : 'BLOCKED' } : dev,
            );
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: newDevices });
          }
        });
      }
    };

    const handleGetCurrentUser = (userId: string) => {
      dispatch({ type: 'SET_CURRENT_USER', user: companyUsers?.find((u) => u.id === userId) });
      dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
    };

    useEffect(() => {
      if (needReReadCompanies && user?.id) {
        console.log('useEffect: needReReadCompanies');
        handleGetCompanies(user.companies ?? [], user.id, 'SET_COMPANIES');
        handleGetUserDevices(user.id, 'SET_DEVICES');
      }
    }, []);

    useEffect(() => {
      if (currentUser?.id) {
        console.log('useEffect: currentUser');
        handleGetCompanies(currentUser.companies ?? [], currentUser.id, 'SET_CURRENT_COMPANIES');
        handleGetUserDevices(currentUser.id, 'SET_CURRENT_DEVICES');
      }
    }, []);

    useEffect(() => {
      console.log('useEffect: isAdmin = ' + isAdmin);
      if (isAdmin !== undefined) {
        dispatch({ type: 'SET_STATE', appState: isAdmin ? 'ADMIN' : 'PROFILE' });
      }
    }, []);

    useEffect(() => {
      if (needReReadUserData) {
        console.log('useEffect: needReReadUserData');
        requests.auth
          .getCurrentUser()
          .then((data) => {
            if (data.type === 'ERROR') {
              dispatch({ type: 'SET_ERROR', errorMessage: data.message });
            } else if (data.type === 'GET_CURRENT_USER') {
              dispatch({ type: 'SET_USER', user: data.user, needReReadCompanies: true });
            } else if (data.type === 'USER_NOT_AUTHENTICATED') {
              dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
              dispatch({ type: 'SET_USER' });
            }
            return;
          })
          .catch((error) => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
      }
    }, []);

    /**
     * Получить пользователей компании надо, когда
     * 1. Выбираем компанию для просмотра\редактирования
     */
    useEffect(() => {
      if (company?.id && needReReadUsers && user) {
        console.log('useEffect: company');
        requests.company
          .getUsersByCompany(company.id)
          .then((data) => {
            if (data.type === 'ERROR') {
              dispatch({ type: 'SET_ERROR', errorMessage: data.message });
            } else if (data.type === 'GET_USERS_BY_COMPANY') {
              dispatch({
                type: 'SET_COMPANY_USERS',
                companyUsers: data.users.map((u) => (u.id === user?.id ? { ...u, isAdmin: true } : u)),
              });
            }
            return;
          })
          .catch((error) => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
      } else {
        dispatch({ type: 'SET_COMPANY_USERS', companyUsers: undefined });
      }
    }, []);

    return appState === 'LOGIN' || appState === 'QUERY_LOGIN' ? (
      <Login
        userName={user?.userName}
        password={user?.password}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={handleLogin}
        onSetSignUp={() => handleSetAppState('SIGNUP')}
        onClearError={handleSetError}
      />
    ) : appState === 'SIGNUP' || appState === 'QUERY_SIGNUP' ? (
      <SignUp
        querying={appState === 'QUERY_SIGNUP'}
        errorMessage={errorMessage}
        onSignUp={handleSignUp}
        onClearError={handleSetError}
      />
    ) : user ? (
      <div>
        <Menu
          querying={appState === 'QUERY_LOGOUT'}
          errorMessage={errorMessage}
          onEditProfile={() => handleSetAppState('PROFILE')}
          onLogOut={handleLogOut}
          onClearError={handleSetError}
          onCreateCompany={() => handleSetAppState('CREATE_COMPANY')}
          onGetCompanies={() => handleSetAppState('ADMIN')}
          onCreateUser={appState === 'UPDATE_COMPANY' ? () => handleSetAppState('CREATE_USER') : undefined}
          onAddUserFromSystem={appState === 'UPDATE_COMPANY' ? handleGetAllUsers : undefined}
          onCreateDevice={
            appState === 'UPDATE_USER' || appState === 'SAVED_PROFILE'
              ? () => handleSetAppState('CREATE_CURRENT_DEVICENAME')
              : appState === 'PROFILE' && isAdmin
                ? () => handleSetAppState('CREATE_DEVICENAME')
                : undefined
          }
          isAdmin={isAdmin}
        />
        {appState === 'ADMIN' && companies ? (
          <AdminBox
            companies={companies?.filter((comp) => comp.admin === user?.id) || []}
            onClearError={handleSetError}
            onSelectCompany={handleSelectCompany}
          />
        ) : appState === 'CREATE_DEVICENAME' || appState === 'CREATE_CURRENT_DEVICENAME' ? (
          <Device
            onUpdateDevice={(title: string) =>
              appState === 'CREATE_DEVICENAME' ? handleCreateDevice(title) : handleCreateCurrentDevice(title)
            }
            onClearError={handleSetError}
          />
        ) : appState === 'CREATE_COMPANY' ? (
          <Company onUpdateCompany={handleCreateCompany} onClearError={handleSetError} />
        ) : appState === 'CREATE_USER' && user?.id ? (
          <User
            user={{ userName: '', id: user?.id, password: '', role: 'User', creatorId: user?.id || '0' }}
            mode={'creating'}
            onCreateProfile={handleCreateUser}
            onClearError={handleSetError}
            isCanEditUser={true}
          />
        ) : appState === 'ADD_USER_FROM_SYSTEM' ? (
          <SystemUser
            allUsers={allUsers}
            companyUsers={companyUsers}
            onAddUser={handleAddSystemUser}
            onClearError={handleSetError}
          />
        ) : appState === 'UPDATE_COMPANY' && company ? (
          <CompanyBox
            companyName={company?.title || ''}
            companyId={company?.id || '0'}
            users={companyUsers}
            allUsers={allUsers}
            onUpdateCompany={handleUpdateCompany}
            onClearError={handleSetError}
            onSelectUser={handleGetCurrentUser}
            onRemoveUsersFromCompany={handleRemoveCompanyUsers}
          />
        ) : (appState === 'UPDATE_USER' || appState === 'SAVED_PROFILE') && currentUser ? (
          <Profile
            user={currentUser}
            companies={currentCompanies}
            devices={currentDevices}
            onClearEditOK={() => handleSetAppState('PROFILE')}
            onEditProfile={(user_: Partial<IUser>) => handleUpdateUser(user_, 'UPDATE_CURRENT_USER')}
            onClearError={handleSetError}
            isCanEditUser={currentUser?.creatorId === user?.id}
            isCanEditDevices={isAdmin}
            onRemoveDevices={handleRemoveCurrentDevices}
            onBlockDevices={handleBlockCurrentDevices}
            onGetCode={handleCreateCurrentCode}
          />
        ) : (appState === 'SHOW_CODE' || appState === 'SHOW_CURRENT_CODE') && activationCode ? (
          <ModalBox
            title={'Код для активации устройства'}
            text={activationCode || ''}
            onClose={() => {
              dispatch({ type: 'SET_ACTIVATION_CODE' });
              handleSetAppState('UPDATE_USER');
            }}
          />
        ) : (
          <Profile
            user={user}
            companies={companies}
            devices={devices}
            isEditOK={appState === 'SAVED_PROFILE'}
            onClearEditOK={() => handleSetAppState('PROFILE')}
            onEditProfile={(user_: Partial<IUser>) => handleUpdateUser(user_, 'UPDATE_USER')}
            onClearError={handleSetError}
            isCanEditUser={true}
            isCanEditDevices={isAdmin}
            onRemoveDevices={handleRemoveDevices}
            onBlockDevices={handleBlockDevices}
            onGetCode={handleCreateCode}
          />
        )}
      </div>
    ) : (
      <div>Тест</div>
    );
  };
};
export default App;
