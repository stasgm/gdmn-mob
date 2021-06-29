import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import { device } from '@lib/mock';

// import { device, device2 } from '@lib/mock';

import { useCallback } from 'react';

import { IDevice } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';

import bindingActions from '../../store/deviceBinding';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import UserDetailsView from '../../components/user/UserDetailsView';

import UserDevices from '../../components/user/UserDevices';
import deviceActions from '../../store/device';
import SnackBar from '../../components/SnackBar';

interface IUserView {
  isSelectDevice?: boolean;
}

const UserView = (props: IUserView) => {
  const { isSelectDevice } = props;
  const { id: userId } = useParams();

  // const [devices, setDevices] = useState<IDevice[]>([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const classes = useStyles();
  //const sourcePath = `/app/users/${userId}/`;

  console.log('UserView_isSelectDevice', isSelectDevice);

  const users = useSelector((state) => state.users);
  const devices = useSelector((state) => state.devices);
  const bindings = useSelector((state) => state.deviceBindings);

  const user = users.list.find((i) => i.id === userId);
  const userDevices: IDevice[] = [];
  bindings.list
    .filter((b) => b.user.id === userId)
    .forEach((b) => {
      const device = devices.list.find((d) => b.device.id === d.id);
      if (device) {
        userDevices.push(device);
      }
    });

  // const devices = useSelector((state) =>
  //   state.deviceBindings.list
  //     .filter((b) => b.user.id === userId)
  //     .map((b) => state.devices.list.find((d) => d.id === b.device.id)),
  // );

  // useEffect(() => {

  // }, []);
  // const { users, usersLoading } = useSelector((state) => state.users); пользователи из хранилища по userId

  // const handleAddDevicesClick = (value: boolean) => {
  //   setIsAddDevices(value);
  // };

  const handleCancel = () => {
    navigate('/app/users');
  };

  const handleEdit = () => {
    navigate(`/app/users/edit/${userId}`);
  };

  const handleAddDevice = () => {
    navigate(`/app/users/${userId}/addDevice`);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const handleRefresh = useCallback(() => {
    dispatch(actions.fetchUserById(userId));
    dispatch(deviceActions.fetchDevices(userId));
    dispatch(bindingActions.fetchDeviceBindings(userId));
  }, [dispatch, userId]);

  const handleDelete = async () => {
    const res = await dispatch(actions.removeUser(userId));
    if (res.type === 'USER/REMOVE_SUCCCES') {
      navigate(-1);
    }
  };

  // const handleSaveSelectedDevices = (selectedDevices: IDevice[]) => {
  //   const newBindings: IDeviceBindings = selectedDevices.map((d) => { user, device: { id: d.id, name: d.name } })
  //   const res = await dispatch(bindingActions.addDeviceBinding(selectedDevices);
  //   if (res.type === 'DEVICEBINDING/ADD_SUCCCES') {
  //     handleGoToCompanyView();
  //   }
  // };

  // useEffect(() => {
  //   setDevices([device, device2]);
  //   if (isSelectDevice) setIsAddDevices(isSelectDevice);

  //   handleRefresh();
  // }, [handleRefresh, isSelectDevice]);

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
            {users.loading && <CircularProgress size={40} />}
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
          devices={userDevices}
          onAddDevice={handleAddDevice}
          // sourcePath={sourcePath}
          // isAddDevices={isAddDevices}
          // onAddDevicesClick={handleAddDevicesClick}
        />
      </Box>
      <SnackBar errorMessage={users.errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserView;
