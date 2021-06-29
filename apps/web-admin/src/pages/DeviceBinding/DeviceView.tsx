import { Box, CardHeader, IconButton, CircularProgress } from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import { device } from '@lib/mock';

import { useCallback, useEffect } from 'react';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/device';
// import CompanyDevices from '../../components/device/CompanyDevices';

import { IToolBarButton } from '../../types';

import ToolBarAction from '../../components/ToolBarActions';

import DeviceDetailsView from '../../components/device/DeviceDetailsView';

// import UserDevices from '../../components/device/';

interface IDeviceView {
  sourcePath?: string;
}

const DeviceView = (props: IDeviceView) => {
  const { sourcePath } = props;
  const { id: deviceId } = useParams();
  const { userid: userId } = useParams();

  console.log('DeviceView_sourcePath', sourcePath);
  console.log('DeviceView_deviceId', deviceId);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const classes = useStyles();

  const { loading } = useSelector((state) => state.devices);
  const device = useSelector((state) => state.devices.list.find((i) => i.id === deviceId));
  // const { devices, devicesLoading } = useSelector((state) => state.devices); пользователи из хранилища по deviceId

  const handleCancel = () => {
    if (sourcePath) {
      navigate(sourcePath.replace(':userid', userId));
      return;
    }

    navigate('/app/devices');
  };

  const handleEdit = () => {
    if (sourcePath) {
      navigate(`${sourcePath.replace(':userid', userId)}/devices/edit/${deviceId}`);
      return;
    }
    navigate(`/app/devices/edit/${deviceId}`);
  };

  const handleRefresh = useCallback(() => {
    dispatch(actions.fetchDeviceById(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  if (!device) {
    return <Box>Устройство не найдено</Box>;
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
      onClick: () => {
        return;
      },
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
            <CardHeader title={'Список устройств'} />
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
      {/* <Box>
        <CardHeader title={'Устройства пользователя'} sx={{ mx: 2 }} />
        <UserDevices devices={[device]} />
      </Box> */}
    </>
  );
};

export default DeviceView;
