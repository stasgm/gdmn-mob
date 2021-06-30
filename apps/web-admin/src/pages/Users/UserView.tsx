import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { device } from '@lib/mock';

import { useCallback, useEffect } from 'react';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import UserDetailsView from '../../components/user/UserDetailsView';

import UserDevices from '../../components/user/UserDevices';

const UserView = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const classes = useStyles();

  const { loading } = useSelector((state) => state.companies);
  const user = useSelector((state) => state.users.list.find((i) => i.id === userId));
  // const { users, usersLoading } = useSelector((state) => state.users); пользователи из хранилища по userId

  const handleCancel = () => {
    navigate('/app/users');
  };

  const handleEdit = () => {
    navigate(`/app/users/edit/${userId}`);
  };

  const handleRefresh = useCallback(() => {
    dispatch(actions.fetchUserById(userId));
  }, [dispatch, userId]);

  const handleDelete = async () => {
    const res = await dispatch(actions.removeUser(userId));
    if (res.type === 'USER/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  if (!user) {
    return <Box>Пользователь не найден</Box>;
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: () => handleRefresh(),
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
            <CardHeader title={'Список пользователей'} />
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
        <UserDevices devices={[device]} />
      </Box>
    </>
  );
};

export default UserView;
