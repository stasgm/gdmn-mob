import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardHeader,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import bindingActions from '../../store/deviceBinding';
import deviceActions from '../../store/device';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import deviceBindingSelectors from '../../store/deviceBinding/selectors';
import deviceSelectors from '../../store/device/selectors';

import { adminPath, deviceStates } from '../../utils/constants';

import DetailsView from '../../components/DetailsView';

import UserDeviceLog from './UserDeviceLog';

export type Params = {
  bindingid: string;
};

const UserDeviceView = () => {
  const { bindingid } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.devices);
  const deviceBinding = deviceBindingSelectors.bindingById(bindingid);
  const device = deviceSelectors.deviceById(deviceBinding?.device.id);
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const deviceBindingDetails: ILinkedEntity[] = useMemo(
    () =>
      deviceBinding
        ? [
            {
              id: 'Наименование',
              value: deviceBinding.device,
              link: `${adminPath}/app/devices/${deviceBinding.device.id}`,
            },
            {
              id: 'Пользователь',
              value: deviceBinding?.user,
              link: `${adminPath}/app/users/${deviceBinding.user.id}`,
            },
            { id: 'Состояние', value: deviceStates[deviceBinding.state] },
            { id: 'Номер', value: device?.uid },
          ]
        : [],
    [device?.uid, deviceBinding],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/users/${deviceBinding?.user.id}/binding/${bindingid}/edit`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(bindingActions.removeDeviceBinding(bindingid));
    if (res.type === 'DEVICEBINDING/REMOVE_SUCCES') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(deviceActions.fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  if (!deviceBinding) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Устройство не найдено
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить привязанное устройство?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Удалить
            </Button>
            <Button onClick={handleClose} color="secondary" variant="contained">
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
          <DetailsView details={deviceBindingDetails} />
        </Box>
      </Box>
      {user?.role === 'SuperAdmin' ? (
        <Box>
          <CardHeader title={'Журнал ошибок устройства пользователя'} sx={{ mx: 2 }} />
          <UserDeviceLog deviceId={device?.uid} userId={deviceBinding.user.id} />
        </Box>
      ) : null}
    </>
  );
};

export default UserDeviceView;
