import { useCallback, useEffect, useState } from 'react';
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
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import deviceBindingSelectors from '../../store/deviceBinding/selectors';
import deviceSelectors from '../../store/device/selectors';

import { adminPath } from '../../utils/constants';
import DeviceBindingDetailsView from '../../components/deviceBinding/DeviceBindingDetailsView';

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
  const device = deviceSelectors.deviceById(deviceBinding?.device.id || '-1');
  const [open, setOpen] = useState(false);

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
          <DeviceBindingDetailsView deviceBinding={deviceBinding} uid={device?.uid} />
        </Box>
      </Box>
    </>
  );
};

export default UserDeviceView;
