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
  Tabs,
  Tab,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from '../../store';
import { bindingActions, bindingSelectors } from '../../store/deviceBinding';
import { deviceActions, deviceSelectors } from '../../store/device';

import { deviceLogActions } from '../../store/deviceLog';

import { ILinkedEntity, IToolBarButton } from '../../types';

import { adminPath, deviceStates } from '../../utils/constants';

import DetailsView from '../../components/DetailsView';
import ToolBarAction from '../../components/ToolBarActions';

import TabPanel from '../../components/TabPanel';

import UserDeviceLog from './UserDeviceLog';
import UserDeviceSettings from './UserDeviceSettings';

export type Params = {
  bindingid: string;
};

const UserDeviceView = () => {
  const { bindingid } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.devices);
  const deviceBinding = bindingSelectors.bindingById(bindingid);
  const device = deviceSelectors.deviceById(deviceBinding?.device.id);
  const { user } = useSelector((state) => state.auth);
  const { fileList, deviceLog, appSettings } = useSelector((state) => state.deviceLogs);

  const [open, setOpen] = useState(false);

  const deviceBindingDetails: ILinkedEntity[] = useMemo(
    () =>
      deviceBinding
        ? [
            {
              id: 'Устройство',
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
      handleCancel();
    }
  };

  const refreshData = useCallback(() => {
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(deviceActions.fetchDevices());
    //Получаем логи и настройки здесь, потому что используются в 2 вкладках
    dispatch(deviceLogActions.fetchDeviceLogFiles());
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

  const userLogFile = useMemo(() => {
    if (!device || !deviceBinding) {
      return;
    }

    return fileList.find((i) => i.producer.id === deviceBinding.user.id && i.device.id === device.id);
  }, [device, deviceBinding, fileList]);

  useEffect(() => {
    if (!userLogFile) {
      return;
    }
    // Загружаем данные при загрузке компонента.
    dispatch(
      deviceLogActions.fetchDeviceLog(userLogFile.id, undefined, userLogFile.appSystem.id, userLogFile.company.id),
    );
  }, [dispatch, userLogFile]);

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

  const [value, setValue] = useState(0);
  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

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
          pb: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'inline-flex' }}>
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
      </Box>
      <Box
        sx={{
          p: 3,
          pt: 0,
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Общая информация" />
          {user?.role === 'SuperAdmin' && <Tab label="Журнал ошибок" />}
          <Tab label="Настройки" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <DetailsView details={deviceBindingDetails} />
        </TabPanel>
        {user?.role === 'SuperAdmin' && (
          <TabPanel value={value} index={1}>
            <UserDeviceLog deviceLog={deviceLog} />
          </TabPanel>
        )}
        <TabPanel value={value} index={2}>
          <UserDeviceSettings appSettings={appSettings} />
        </TabPanel>
      </Box>
    </>
  );
};

export default UserDeviceView;
