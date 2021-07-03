import { useCallback, useEffect } from 'react';
import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import deviceActions from '../../store/device';
import userActions from '../../store/user';
import bindingActions from '../../store/deviceBinding';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import DeviceDetailsView from '../../components/device/DeviceDetailsView';
import UserListTable from '../../components/user/UserListTable';
import userSelectors from '../../store/user/selectors';
import deviceSelectors from '../../store/device/selectors';
import SnackBar from '../../components/SnackBar';

const DeviceView = () => {
  const { id: deviceId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.devices);

  const device = deviceSelectors.deviceById(deviceId);
  const users = userSelectors.usersByDeviceId(deviceId);

  const handleCancel = () => {
    navigate('/app/devices');
  };

  const handleEdit = () => {
    navigate(`/app/devices/edit/${deviceId}`);
  };

  const handleDelete = async () => {
    const res = await dispatch(deviceActions.removeDevice(deviceId));
    if (res.type === 'DEVICE/REMOVE_SUCCCES') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(userActions.fetchUsers());
  }, [dispatch, deviceId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClearError = () => {
    dispatch(deviceActions.deviceActions.clearError());
  };

  if (!device) {
    return <Box>Устройство не найдено</Box>;
  }

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: refreshData,
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleEdit,
      icon: <EditIcon />,
    },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleDelete,
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
          <DeviceDetailsView device={device} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Пользователи устройства'} sx={{ mx: 2 }} />
        <UserListTable users={users} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceView;
