import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IUser, NewUser } from '@lib/types';

import UserDetails from '../../components/user/UserDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/user';

const UserCreate = () => {
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.users);

  const goBack = () => {
    navigate(-1);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const handleSubmit = async (values: IUser | NewUser) => {
    const res = await dispatch(actions.addUser(values as NewUser));
    if (res.type === 'USER/ADD_SUCCESS') {
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
        <UserDetails user={{} as NewUser} loading={loading} onSubmit={handleSubmit} onCancel={goBack} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserCreate;
