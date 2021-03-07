import { IUser, IUserCredentials } from '@lib/types';
import React, { createContext, useState, useEffect, useContext } from 'react';

import api from '../services/api';

interface IAuthContextData {
  user: IUser | null;
  signIn(user: IUserCredentials): Promise<boolean>;
  signOut(): Promise<boolean>;
}

const AUTH_CONTEXT_ERROR =
  'Authentication context not found. Have your wrapped your components with AuthContext.Consumer?';

const initialState: IAuthContextData = {
  user: null,
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
};

const AuthContext = createContext<IAuthContextData>(initialState);

const isUser = (obj: unknown): obj is IUser => obj instanceof Object && 'id' in obj;

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const loadStoragedData = async () => {
    console.log('load');
  };

  const signIn = async (authUser: IUserCredentials): Promise<boolean> => {
    if (!(authUser.userName && authUser.password)) {
      return false;
    }

    try {
      /*       const response = await api.login({
              userName: authUser.userName,
              password: authUser.password,
            });
       */
      // const userObj = response.data;
      const userObj: IUser = {
        id: '1',
        creatorId: '1',
        password: '1',
        role: 'Admin',
        userName: 'Шляхтич Станислав',
        firstName: 'Станислав',
        lastName: 'Шляхтич ',
        companies: ['ОДО Золотые Программы'],
      };

      // console.log(userObj);

      if (!userObj) {
        throw new Error('Server error');
        // throw new Error(response.error);
      }

      if (!isUser(userObj)) {
        throw new Error('Server error');
      }

      setUser(userObj);

      return true;
    } catch (error) {
      return false;
    }
  };

  const signOut = async () => {
    try {
      const response = await api.logout();
      setUser(null);
      return response.result;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    loadStoragedData();
  }, []);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };
