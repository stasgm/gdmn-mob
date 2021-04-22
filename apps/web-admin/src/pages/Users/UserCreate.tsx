import { Box, CardHeader, CircularProgress } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IUser, NewUser } from '@lib/types';

import UserDetails from '../../components/user/UserDetails';
import SnackBar from '../../components/SnackBar';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';

const UserCreate = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { errorMessage, loading } = useSelector((state) => state.companies);

  const handleGoToUsers = () => {
    navigate('/app/users');
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const handleSubmit = (values: IUser | NewUser) => {
    dispatch(actions.addUser(values as NewUser, handleGoToUsers));
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
            <CardHeader title={'Добавление компании'} />
            {loading && <CircularProgress size={40} />}
          </Box>
        </Box>
        <UserDetails
          user={{ name: '' } as NewUser}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleGoToUsers}
        />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserCreate;
