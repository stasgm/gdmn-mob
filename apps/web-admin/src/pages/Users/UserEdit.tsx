import { Box, CircularProgress, CardHeader } from '@material-ui/core';

import { useNavigate, useParams } from 'react-router-dom';
import { IUser, NewUser } from '@lib/types';

import UserDetails from '../../components/user/UserDetails';

import { useSelector, useDispatch, AppDispatch } from '../../store';
import actions from '../../store/user';
import SnackBar from '../../components/SnackBar';

const UserEdit = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.users);
  const user = useSelector((state) => state.users.list.find((i) => i.id === userId));

  const handleGoToUserView = () => {
    navigate(`/app/users/${userId}`);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const handleSubmit = async (values: IUser | NewUser) => {
    const res = await dispatch(actions.updateUser(values as IUser));
    if (res.type === 'USER/UPDATE_SUCCCES') {
      handleGoToUserView();
    }
  };

  if (!user) {
    return <Box>Пользователь не найден</Box>;
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
      <UserDetails user={user} loading={loading} onSubmit={handleSubmit} onCancel={handleGoToUserView} />
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </Box>
  );
};

export default UserEdit;
