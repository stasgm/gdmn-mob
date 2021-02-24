import React, { useReducer, useCallback, useEffect } from 'react';
import { IUser, IUserCompany } from './types';
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
import { login, signup, logout, createCode, getCurrentUser } from './service/auth.requests';
import { getAllUsers, updateUser, getUserDevices, getUser } from './service/user.requests';
import { createDevice, deleteDevice, blockDevice } from './service/device.request';
import { getCompany, createCompany, updateCompany, getAllCompanies, getCompanyUsers } from './service/company.requests';
import { IDeviceInfo } from '../../common';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'QUERY_LOGOUT' | 'SIGNUP' | 'SIGNUP_CODE' | 'QUERY_SIGNUP' | 'PROFILE' | 'SAVED_PROFILE'
  | 'ADMIN' | 'CREATE_COMPANY' | 'UPDATE_COMPANY' | 'CREATE_USER' | 'ADD_USER_FROM_SYSTEM' | 'SHOW_CODE' | 'SHOW_CURRENT_CODE' | 'UPDATE_USER' | 'CREATE_DEVICENAME' | 'CREATE_CURRENT_DEVICENAME';

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
  company?: IUserCompany;
  companies?: IUserCompany[];
  devices?: IDeviceInfo[];
  currentUser?: IUser;
  currentCompanies?: IUserCompany[];
  currentDevices?: IDeviceInfo[];
  companyUsers?: IUser[];
  allUsers?: IUser[];
  errorMessage?: string;
  isAdmin?: boolean;
  needReReadCompanies?: boolean;
  needReReadUsers?: boolean;
  needReReadUserData?: boolean;
};

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser, needReReadCompanies?: boolean, needReReadUserData?: boolean }
  | { type: 'UPDATE_USER', user: Partial<IUser> }
  | { type: 'SET_ACTIVATION_CODE', code?: string }
  | { type: 'SET_COMPANY_USERS', companyUsers?: IUser[] }
  | { type: 'SET_ALL_USERS', allUsers?: IUser[] }
  | { type: 'CREATE_COMPANY', company: IUserCompany }
  | { type: 'SET_COMPANY', company?: IUserCompany, needReReadUsers?: boolean }
  | { type: 'SET_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_CURRENT_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_CURRENT_USER', user?: IUser }
  | { type: 'UPDATE_CURRENT_USER', user: Partial<IUser> }
  | { type: 'SET_IS_ADMIN', isAdmin?: boolean }
  | { type: 'UPDATE_COMPANY', companyId: string, companyName: string }
  | { type: 'SET_DEVICES', devices?: IDeviceInfo[] }
  | { type: 'SET_CURRENT_DEVICES', devices?: IDeviceInfo[] }
  | { type: 'UPDATE_CURRENT_DEVICE', device: IDeviceInfo }
  | { type: 'DELETE_CURRENT_DEVICE', uId: string }
  | { type: 'SET_ERROR', errorMessage?: string };

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
        //  needReReadCompanies: state.needReReadCompanies || (state.appState !== action.appState && (action.appState === 'LOGIN' ))
      }
    }
    case 'SET_ERROR': {
      const { errorMessage } = action;
      return {
        ...state,
        errorMessage
      }
    }
    case 'SET_USER': {
      const { user, needReReadCompanies, needReReadUserData } = action;
      return {
        ...state,
        user,
        needReReadCompanies,
        needReReadUserData,
        currentUser: undefined
      }
    }
    case 'UPDATE_USER': {
      const { user } = action;
      return {
        ...state,
        user: state.user ? { ...state.user, ... user } : undefined,
      }
    }
    case 'SET_ACTIVATION_CODE': {
      return {
        ...state,
        activationCode: action.code
      }
    }
    case 'SET_COMPANY_USERS': {
      const { companyUsers } = action;
      return {
        ...state,
        companyUsers
      }
    }
    case 'SET_ALL_USERS': {
      const { allUsers } = action;
      return {
        ...state,
        allUsers
      }
    }
    case 'CREATE_COMPANY': {
      const { company } = action;
      return {
        ...state,
        companies: state.companies ? [...state.companies, company] : [company]
      }
    }
    case 'UPDATE_COMPANY': {
      const { companyId, companyName } = action;
      return {
        ...state,
        companies: state.companies?.map(comp => comp.companyId === companyId ? { ...comp, companyName } : comp)
      }
    }
    case 'SET_COMPANIES': {
      /**
       * При загрузке списка компаний, мы проверяем есть ли среди них
       * хотя бы одна, для которой текущий пользователь является администратором
       * и выставляем соответствующий флаг в стэйте.
       */

      const { companies } = action;
      const isAdmin = companies?.some(c => c.userRole === 'Admin');
      return {
        ...state,
        companies,
        needReReadCompanies: false,
        isAdmin
      }
    }
    case 'SET_CURRENT_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        currentCompanies: companies
      }
    }
    case 'SET_COMPANY': {
      const { company, needReReadUsers } = action;
      return {
        ...state,
        company,
        needReReadUsers
      }
    }
    case 'SET_CURRENT_USER': {
      const { user } = action;
      return {
        ...state,
        currentUser: user
      }
    }
    case 'UPDATE_CURRENT_USER': {
      const { user } = action;
      return {
        ...state,
        currentUser: state.currentUser ? { ...state.currentUser, ...user} : undefined,
      }
    }

    case 'SET_IS_ADMIN': {
      const { isAdmin } = action;
      return {
        ...state,
        isAdmin
      }
    }

    case 'SET_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        devices
      }
    }

    case 'SET_CURRENT_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        currentDevices: devices
      }
    }

    case 'UPDATE_CURRENT_DEVICE': {
      const { device } = action;
      const { currentDevices } = state;
      const idx = currentDevices?.findIndex(item => item.deviceId === device.deviceId);
      if (currentDevices && idx !== undefined && idx > -1) {
        return {
          ...state,
          currentDevices: [...currentDevices?.slice(0, idx), device, ...currentDevices?.slice(idx + 1)]
        }
      } else {
        return state;
      }
    }

    case 'DELETE_CURRENT_DEVICE': {
      const { uId } = action;
      const { currentDevices } = state;
      if (currentDevices) {
        return {
          ...state,
          currentDevices: currentDevices.filter(item => item.deviceId !== uId)
        }
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

const App: React.FC = () => {
  const [{ appState, user, activationCode, companies, currentCompanies, company, companyUsers, allUsers, errorMessage, isAdmin, currentUser,
    devices, currentDevices, needReReadCompanies, needReReadUsers, needReReadUserData }, dispatch] = useReducer(reducer, {
      appState: 'LOGIN',
      needReReadUserData: true

    });

  console.log('appState: ' + appState);

  const handleSetError = useCallback((errorMessage?: string) => {
    dispatch({ type: 'SET_ERROR', errorMessage })
  }, [dispatch]);

  const handleSetAppState = useCallback((appState: AppState) => {
    dispatch({ type: 'SET_STATE', appState })
  }, [dispatch]);

  const handleLogin = (userName: string, password: string) => {
    console.log('handleLogin');
    login(userName, password)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'LOGIN') {
          dispatch({ type: 'SET_USER', needReReadUserData: true });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleSignUp = (userName: string, password: string) => {
    signup(userName, password)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'SIGNUP') {
          //dispatch({ type: 'SET_USER', user: data.user });
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleLogOut = () => {
    logout()
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'LOGOUT') {
          dispatch({ type: 'SET_COMPANY', company: undefined });
          dispatch({ type: 'SET_USER', user: undefined });
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: undefined });
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleGetAllUsers = () => {
    getAllUsers()
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'ALL_USERS') {
          dispatch({ type: 'SET_ALL_USERS', allUsers: data.users.filter(u => u.id !== user?.id) });
          dispatch({ type: 'SET_STATE', appState: 'ADD_USER_FROM_SYSTEM' })
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleCreateCode = (deviceId: string) => {
    if (deviceId) {
      createCode(deviceId)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'USER_CODE') {
            dispatch({ type: 'SET_ACTIVATION_CODE', code: data.code });
            dispatch({ type: 'SET_DEVICES', devices: devices?.map(d => d.id === deviceId ? { ...d, state: d.state } : { ...d }) });
            dispatch({ type: 'SET_STATE', appState: 'SHOW_CODE' })
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleCreateCurrentCode = (deviceId: string) => {
    if (deviceId) {
      createCode(deviceId)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'USER_CODE') {
            dispatch({ type: 'SET_ACTIVATION_CODE', code: data.code });
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: currentDevices?.map(d => d.id === deviceId ? { ...d, state: 'NON-ACTIVATED' } : { ...d }) });
            dispatch({ type: 'SET_STATE', appState: 'SHOW_CURRENT_CODE' });
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleCreateDevice = (title: string) => {
    console.log('handleCreateDevice.user: ', user);
    if (user?.id) {
      createDevice(title, user.id)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'CREATE_DEVICENAME') {
            dispatch({
              type: 'SET_DEVICES',
              devices: devices
                ? [...devices, { id: data.uid, deviceId: '', deviceName: title, userId: user.id ?? '', userName: user.userName, state: 'NEW' }]
                : [{ id: data.uid, deviceId: '', deviceName: title, userId: user.id ?? '', userName: user.userName, state: 'NEW' }]
            });
            dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' })
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleCreateCurrentDevice = (title: string) => {
    console.log('handleCreateCurrentDevice.currentUser: ', currentUser);
    if (currentUser?.id) {
      createDevice(title, currentUser.id)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'CREATE_DEVICENAME') {
            dispatch({
              type: 'SET_CURRENT_DEVICES',
              devices: currentDevices
                ? [
                  ...currentDevices,
                  { id: data.uid, deviceId: '', deviceName: title, userId: currentUser.id ?? '', userName: currentUser.userName, state: 'NEW' }
                ]
                : [{ id: data.uid, deviceId: '', deviceName: title, userId: currentUser.id ?? '', userName: currentUser.userName, state: 'NEW' }]
            });
            dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' })
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleSelectCompany = (companyId: string) => {
    getCompany(companyId)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'USER_COMPANY') {
          dispatch({ type: 'SET_COMPANY', company: data.company, needReReadUsers: true });
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleCreateCompany = (companyName: string) => {
    createCompany(companyName)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'NEW_COMPANY') {
          const newCompany: IUserCompany = { companyName, companyId: companyName, userRole: 'Admin' }
          dispatch({ type: 'SET_COMPANY', company: newCompany });
          dispatch({ type: 'SET_COMPANIES', companies: (companies ? [...companies, newCompany] : [newCompany]).filter(c => c.userRole === 'Admin') });
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: true });
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleCreateUser = (new_user: IUser) => {
    if (company?.companyId && user?.id) {
      signup(new_user.userName, new_user.password ?? '', company.companyId, user.id)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'SIGNUP') {
            //dispatch({ type: 'SET_CURRENT_USER', user: data.user });
            dispatch({ type: 'SET_COMPANY_USERS', companyUsers: companyUsers ? [...companyUsers, { ...new_user, id: data.userId }] : [{ ...new_user, id: data.userId }] });
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: [] });
            dispatch({ type: 'SET_COMPANIES', companies: companies?.filter(c => c.companyId === company.companyId) });
            dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleAddSystemUser = (userId: string) => {
    const systemUuser = allUsers?.find(item => item.id === userId);
    if (company?.companyId && systemUuser) {
      updateUser({ ...systemUuser, companies: systemUuser.companies ? [...systemUuser.companies, company?.companyId] : [company?.companyId] })
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'UPDATE_USER') {
            const addedUser = allUsers?.find(u => u.id === userId);
            if (addedUser) {
              dispatch({ type: 'SET_CURRENT_USER', user: { ...addedUser } });
              dispatch({ type: 'SET_COMPANY_USERS', companyUsers: companyUsers ? [...companyUsers, addedUser] : [addedUser] });
              dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
            }
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  };

  const handleUpdateCompany = (companyId: string, companyName: string) => {
    updateCompany(companyName, companyId)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'UPDATE_COMPANY') {
          dispatch({ type: 'UPDATE_COMPANY', companyId, companyName });
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleGetCompanies = (companies: string[], userId: string, type: 'SET_COMPANIES' | 'SET_CURRENT_COMPANIES') => {
    getAllCompanies()
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'USER_COMPANIES') {
          const getCompanies = data.companies
            .filter(item => companies.some(company => company === item.id))
            .map(item => { return { companyId: item.id, companyName: item.title, userRole: item.admin === userId ? 'Admin' : undefined } as IUserCompany });
          dispatch({ type: type, companies: getCompanies });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleGetUserDevices = (userId: string, type: 'SET_DEVICES' | 'SET_CURRENT_DEVICES') => {
    getUserDevices(userId)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'USER_DEVICES') {
          dispatch({ type, devices: data.devices })
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };

  const handleUpdateUser = (editUser: Partial<IUser>, type: 'UPDATE_USER' | 'UPDATE_CURRENT_USER') => {
    updateUser(editUser)
      .then(data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'UPDATE_USER') {
          dispatch({ type, user: editUser });
          dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
        }
      })
      .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
  };


  const handleRemoveCompanyUsers = (userIds: string[]) => {
    if (company?.companyId) {
      const uIds = userIds.filter(u => u !== user?.id);
      uIds.forEach(uId => {
        getUser(uId)
          .then(data => {
            if (data.type === 'ERROR') {
              dispatch({ type: 'SET_ERROR', errorMessage: data.message });
            }
            else if (data.type === 'GET_USER') {
              if (data.user && data.user.companies) {
                updateUser({ ...data.user, companies: data.user.companies.filter((item) => item !== company?.companyId) })
                  .then(data => {
                    if (data.type === 'ERROR') {
                      dispatch({ type: 'SET_ERROR', errorMessage: data.message });
                    }
                    else if (data.type === 'UPDATE_USER') {
                      dispatch({ type: 'SET_USER', user });
                      dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
                    }
                  })
                  .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
              }
            }
          })
          .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
      });
    }
  };

  const handleRemoveDevices = async (uIds: string[]) => {
    uIds.forEach(uId => {
      if (user && user.id) {
        deleteDevice(uId)
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'REMOVE_DEVICES') {
            const newDevices = devices?.filter(c => uId !== c.id);
            dispatch({ type: 'SET_DEVICES', devices: newDevices});
          }
        })
        .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
      }
    });
  };

  const handleBlockDevices = (uIds: string[], isUnBlock: boolean) => {
    uIds.forEach(uId => {
      if (user && user.id) {
        const device = devices?.find(dev => dev.id === uId);
        if (!device) {
          dispatch({ type: 'SET_ERROR', errorMessage: 'Устройство не найдено.' });
          return;
        }
        blockDevice({id: device.id, uid: device.deviceId, state: !isUnBlock ? 'BLOCKED' : 'ACTIVE'})
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'BLOCK_DEVICES') {
            const idx = devices?.findIndex(dev => dev.deviceId === uId);
            if (devices && idx !== undefined) {
              const newDevices: IDeviceInfo[] =  devices.map(dev => dev.id === device.id ? {...dev, state: isUnBlock ? 'ACTIVE' : 'BLOCKED'} : dev);
                dispatch({ type: 'SET_DEVICES', devices: newDevices });
              }
            }
          })
          .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
      }
    });
  };

  const handleRemoveCurrentDevices = (uIds: string[]) => {
    uIds.forEach(uId => {
      if (currentUser?.id) {
        deleteDevice(uId)
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'REMOVE_DEVICES') {
            dispatch({ type: 'DELETE_CURRENT_DEVICE', uId});
            const newDevices = currentDevices?.filter(c => uId !== c.id);
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: newDevices});
          }
        })
        .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
      }
    });
  };

  const handleBlockCurrentDevices = (uIds: string[], isUnBlock: boolean) => {
    uIds.forEach(uId => {
      if (currentUser?.id) {
        const device = currentDevices?.find(dev => dev.id === uId);
        if (!device) {
          dispatch({ type: 'SET_ERROR', errorMessage: 'Устройство не найдено.' });
          return;
        }
        blockDevice({id: device.id, uid: device.deviceId, state: isUnBlock ? 'ACTIVE' : 'BLOCKED'})
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'BLOCK_DEVICES') {
            const idx = currentDevices?.findIndex(dev => dev.deviceId === uId);
            if (currentDevices && idx !== undefined) {
              const newDevices: IDeviceInfo[] = currentDevices.map(dev => dev.id === device.id ? {...dev, state: isUnBlock ? 'ACTIVE' : 'BLOCKED'} : dev);
                dispatch({ type: 'SET_CURRENT_DEVICES', devices: newDevices });
              }
            }
          })
          .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
      }
    })
  };

  const handleGetCurrentUser = (userId: string) => {
    dispatch({ type: 'SET_CURRENT_USER', user: companyUsers?.find(u => u.id === userId) });
    dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
  };

  useEffect(() => {
    if (needReReadCompanies && user?.id) {
      console.log('useEffect: needReReadCompanies');
      handleGetCompanies(user.companies ?? [], user.id, 'SET_COMPANIES');
      handleGetUserDevices(user.id, 'SET_DEVICES');
    }
  }, [needReReadCompanies, user]);

  useEffect(() => {
    if (currentUser?.id) {
      console.log('useEffect: currentUser');
      handleGetCompanies(currentUser.companies ?? [], currentUser.id, 'SET_CURRENT_COMPANIES');
      handleGetUserDevices(currentUser.id, 'SET_CURRENT_DEVICES');
    }
  }, [currentUser]);

  useEffect(() => {
    console.log('useEffect: isAdmin = ' + isAdmin);
    if (isAdmin !== undefined) {
      dispatch({ type: 'SET_STATE', appState: isAdmin ? 'ADMIN' : 'PROFILE' });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (needReReadUserData) {
      console.log('useEffect: needReReadUserData');
      getCurrentUser()
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'USER') {
            dispatch({ type: 'SET_USER', user: data.user, needReReadCompanies: true });
          } else if (data.type === 'USER_NOT_AUTHENTICATED') {
            dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
            dispatch({ type: 'SET_USER' });
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    }
  }, [needReReadUserData])


  /**
   * Получить пользователей компании надо, когда
   * 1. Выбираем компанию для просмотра\редактирования
   */
  useEffect(() => {
    if (company?.companyId && needReReadUsers && user) {
      console.log('useEffect: company');
      getCompanyUsers(company.companyId)
        .then(data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'COMPANY_USERS') {
            dispatch({ type: 'SET_COMPANY_USERS', companyUsers: data.users.map(u => u.id === user?.id ? { ...u, isAdmin: true } : u) });
          }
        })
        .catch(error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }));
    } else {
      dispatch({ type: 'SET_COMPANY_USERS', companyUsers: undefined });
    }
  }, [company, needReReadUsers, user])

  return (
    appState === 'LOGIN' || appState === 'QUERY_LOGIN'
      ?
      <Login
        userName={user?.userName}
        password={user?.password}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={handleLogin}
        onSetSignUp={() => handleSetAppState('SIGNUP')}
        onClearError={handleSetError}
      />
      :
      appState === 'SIGNUP' || appState === 'QUERY_SIGNUP'
        ?
        <SignUp
          querying={appState === 'QUERY_SIGNUP'}
          errorMessage={errorMessage}
          onSignUp={handleSignUp}
          onClearError={handleSetError}
        />
        : user
          ?
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
                    : undefined}
              isAdmin={isAdmin}
            />
            {appState === 'ADMIN' && companies
              ?
              <AdminBox
                companies={companies?.filter(comp => comp.userRole)}
                onClearError={handleSetError}
                onSelectCompany={handleSelectCompany}
              />
              : appState === 'CREATE_DEVICENAME' || appState === 'CREATE_CURRENT_DEVICENAME'
                ?
                <Device
                  onUpdateDevice={(title: string) => appState === 'CREATE_DEVICENAME' ? handleCreateDevice(title) : handleCreateCurrentDevice(title)}
                  onClearError={handleSetError}
                />
                : appState === 'CREATE_COMPANY'
                  ?
                  <Company
                    onUpdateCompany={handleCreateCompany}
                    onClearError={handleSetError}
                  />
                  : appState === 'CREATE_USER' && user?.id
                    ?
                    <User
                      user={{ userName: '', creatorId: user.id }}
                      mode={'creating'}
                      onCreateProfile={handleCreateUser}
                      onClearError={handleSetError}
                      isCanEditUser={true}
                    />
                    : appState === 'ADD_USER_FROM_SYSTEM'
                      ?
                      <SystemUser
                        allUsers={allUsers}
                        companyUsers={companyUsers}
                        onAddUser={handleAddSystemUser}
                        onClearError={handleSetError}
                      />
                      : appState === 'UPDATE_COMPANY' && company
                        ?
                        <CompanyBox
                          companyName={company.companyName}
                          companyId={company.companyId}
                          users={companyUsers}
                          allUsers={allUsers}
                          onUpdateCompany={handleUpdateCompany}
                          onClearError={handleSetError}
                          onSelectUser={handleGetCurrentUser}
                          onRemoveUsersFromCompany={handleRemoveCompanyUsers}
                        />
                        : (appState === 'UPDATE_USER' || appState === 'SAVED_PROFILE') && currentUser
                          ?
                          <Profile
                            user={currentUser}
                            companies={currentCompanies}
                            devices={currentDevices}
                            onClearEditOK={() => handleSetAppState('PROFILE')}
                            onEditProfile={(user: Partial<IUser>) => handleUpdateUser(user, 'UPDATE_CURRENT_USER')}
                            onClearError={handleSetError}
                            isCanEditUser={currentUser.creatorId === user.id}
                            isCanEditDevices={isAdmin}
                            onRemoveDevices={handleRemoveCurrentDevices}
                            onBlockDevices={handleBlockCurrentDevices}
                            onGetCode={handleCreateCurrentCode}
                          />
                          : (appState === 'SHOW_CODE' || appState === 'SHOW_CURRENT_CODE') && activationCode
                            ?
                            <ModalBox
                              title={'Код для активации устройства'}
                              text={activationCode}
                              onClose={() => {
                                dispatch({ type: 'SET_ACTIVATION_CODE' });
                                handleSetAppState('UPDATE_USER');
                              }}
                            />
                            :
                            <Profile
                              user={user}
                              companies={companies}
                              devices={devices}
                              isEditOK={appState === 'SAVED_PROFILE'}
                              onClearEditOK={() => handleSetAppState('PROFILE')}
                              onEditProfile={(user: Partial<IUser>) => handleUpdateUser(user, 'UPDATE_USER')}
                              onClearError={handleSetError}
                              isCanEditUser={true}
                              isCanEditDevices={isAdmin}
                              onRemoveDevices={handleRemoveDevices}
                              onBlockDevices={handleBlockDevices}
                              onGetCode={handleCreateCode}
                            />
            }

          </div>
          :
          <div>Тест</div>
  );
};

export default App;
