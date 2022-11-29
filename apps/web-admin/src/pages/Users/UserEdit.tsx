import { Box, CircularProgress, CardHeader } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IUser, NewUser } from '@lib/types';
import { useEffect } from 'react';

import UserDetails from '../../components/user/UserDetails';
import { useSelector, useDispatch, AppDispatch } from '../../store';
import appSystemActions from '../../store/appSystem';
import userActions from '../../store/user';
import selectors from '../../store/user/selectors';

export type Params = {
  id: string;
};

const UserEdit = () => {
  const { id: userId } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { loading } = useSelector((state) => state.users);
  const user = selectors.userById(userId);

  useEffect(() => {
    dispatch(appSystemActions.fetchAppSystems());
    dispatch(userActions.fetchUsers());
  }, [dispatch]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: IUser | NewUser) => {
    const res = await dispatch(userActions.updateUser(values as IUser));
    if (res.type === 'USER/UPDATE_SUCCESS') {
      goBack();
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Пользователь не найден
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CardHeader title={'Редактирование пользователя'} />
        {loading && <CircularProgress size={40} />}
      </Box>
      <UserDetails user={user} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
    </Box>
  );
};

export default UserEdit;
