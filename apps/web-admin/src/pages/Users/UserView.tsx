import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { IDevice } from '@lib/types';

import { device, device2 } from '@lib/mock';

import { useCallback, useEffect, useState } from 'react';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import UserDetailsView from '../../components/user/UserDetailsView';

import UserDevices from '../../components/user/UserDevices';

interface IUserView {
  isSelectDevice?: boolean;
}

const UserView = (props: IUserView) => {
  const { isSelectDevice } = props;
  const [isAddDevices, setIsAddDevices] = useState(false);
  const { id: userId } = useParams();

  // const { devices, newDevices } = useSelector((state) => state.devices);
  const [devices, setDevices] = useState<IDevice[]>([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const classes = useStyles();
  const sourcePath = `/app/users/${userId}/`;

  console.log('UserView_isSelectDevice', isSelectDevice);

  const { loading } = useSelector((state) => state.companies);
  const user = useSelector((state) => state.users.list.find((i) => i.id === userId));
  // const { users, usersLoading } = useSelector((state) => state.users); пользователи из хранилища по userId

  const handleAddDevicesClick = (value: boolean) => {
    setIsAddDevices(value);
  };

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
    if (res.type === 'USER/REMOVE_SUCCCES') {
      navigate(-1);
    }
  };

  const handleDeviceListSave = (newDeviceList: IDevice[]) => {
    setDevices(newDeviceList);
  };

  useEffect(() => {
    setDevices([device, device2]);
    if (isSelectDevice) setIsAddDevices(isSelectDevice);

    handleRefresh();
  }, [handleRefresh, isSelectDevice]);

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
        <UserDevices
          devices={devices}
          handleDeviceListSave={(newDeviceList) => handleDeviceListSave(newDeviceList)}
          sourcePath={sourcePath}
          isAddDevices={isAddDevices}
          onAddDevicesClick={handleAddDevicesClick}
        />
      </Box>
    </>
  );
};

export default UserView;
