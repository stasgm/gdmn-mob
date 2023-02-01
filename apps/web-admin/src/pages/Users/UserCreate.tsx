import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IUser, IUserCredentials, NewUser } from '@lib/types';

import { useEffect } from 'react';

import { authActions, useAuthThunkDispatch } from '@lib/store';

import UserDetails from '../../components/user/UserDetails';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import appSystemActions from '../../store/appSystem';
import userActions from '../../store/user';
import { webRequest } from '../../store/webRequest';

const UserCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();

  const { loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(userActions.fetchUsers());
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IUser | NewUser) => {
    const res = await dispatch(userActions.addUser(values as NewUser));
    if (res.type === 'USER/ADD_SUCCESS') {
      goBack();
    }
  };

  const handleSubmitAdmin = async (values: IUserCredentials) => {
    const res = await authDispatch(authActions.signup(webRequest(dispatch, authActions), values));

    if (res.type === 'AUTH/SIGNUP_SUCCESS') {
      goBack();
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex', marginBottom: 1 }}>
            <CardHeader title={'Добавление пользователя'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <UserDetails
          user={{} as NewUser}
          loading={loading}
          onSubmit={handleSubmit}
          onSubmitAdmin={handleSubmitAdmin}
          onCancel={goBack}
        />
      </Box>
    </>
  );
};

export default UserCreate;
