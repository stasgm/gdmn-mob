import { action } from 'typesafe-actions';

import { UsersTypes, User } from './types';

const fetchUser = (payload: string) => action(UsersTypes.FETCH, payload);

const fetchUserSuccess = (payload: User) => action(UsersTypes.FETCH_SUCCCES, payload);

const fetchUserFailure = (payload: string) => action(UsersTypes.FETCH_FAILURE, payload);

export { fetchUser, fetchUserSuccess, fetchUserFailure };
