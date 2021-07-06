import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useCallback, useEffect } from 'react';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';
import selectors from '../../store/user/selectors';
import bindingSelectors from '../../store/deviceBinding/selectors';
import bindingActions from '../../store/deviceBinding';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import UserDetailsView from '../../components/user/UserDetailsView';
import UserDevices from '../../components/user/UserDevices';
import SnackBar from '../../components/SnackBar';

const UserView = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.users);
  const user = selectors.userById(userId);

  const userDevices = bindingSelectors.bindingsByUserId(userId);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/app/users/edit/${userId}`);
  };

  const handleAddDevice = () => {
    navigate(`/app/users/${userId}/devices/new`);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const refreshData = useCallback(() => {
    dispatch(actions.fetchUserById(userId));
    dispatch(bindingActions.fetchDeviceBindings(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    refreshData();
  }, [refreshData]);

  const handleDelete = async () => {
    const res = await dispatch(actions.removeUser(userId));
    if (res.type === 'USER/REMOVE_SUCCCES') {
      navigate(-1);
    }
  };

  if (!user) {
    return <Box>Пользователь не найден</Box>;
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: () => refreshData(),
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: () => handleEdit(),
      icon: <EditIcon />,
    },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: () => handleDelete(),
      icon: <DeleteIcon />,
    },
  ];

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
            <IconButton color="primary" onClick={handleCancel}>
              <ArrowBackIcon />
            </IconButton>
            <CardHeader title={'Назад'} />
            {loading && <CircularProgress size={40} />}
          </Box>
          <Box
            sx={{
              justifyContent: 'right',
            }}
          >
            <ToolBarAction buttons={buttons} />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
          }}
        >
          <UserDetailsView user={user} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Устройства пользователя'} sx={{ mx: 2 }} />
        <UserDevices userDevices={userDevices} onAddDevice={handleAddDevice} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserView;
