import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../store';
import { bindingActions, bindingSelectors } from '../../store/deviceBinding';
import { deviceActions, deviceSelectors } from '../../store/device';

import { ILinkedEntity, IToolBarButton } from '../../types';

import { adminPath, deviceStates } from '../../utils/constants';

import DetailsView from '../../components/DetailsView';

import ConfirmDialog from '../../components/ConfirmDialog';

import ViewContainer from '../../components/ViewContainer';

import { deviceLogActions } from '../../store/deviceLog';

import UserDeviceSettings from './UserDeviceSettings';
import UserDeviceLog from './UserDeviceLog';

export type Params = {
  bindingid: string;
};

const UserDeviceView = () => {
  const { bindingid } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageParams, loading: bindingLoading } = useSelector((state) => state.deviceBindings);
  const { loading: deviceLoading } = useSelector((state) => state.devices);
  const {
    appSettings,
    loading: deviceLogLoading,
    fileList,
    deviceLog,
    appVersion,
  } = useSelector((state) => state.deviceLogs);
  const deviceBinding = bindingSelectors.bindingById(bindingid);
  const device = deviceSelectors.deviceById(deviceBinding?.device.id);
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(pageParams?.tab || 0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(bindingActions.setPageParam({ tab: newValue }));
  };

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
            { id: 'Версия приложения', value: appVersion },
          ]
        : [],
    [appVersion, device?.uid, deviceBinding],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const refreshData = useCallback(() => {
    dispatch(deviceActions.fetchDevices());
    dispatch(bindingActions.fetchDeviceBindings());
    dispatch(deviceLogActions.fetchDeviceLogFiles());
  }, [dispatch]);

  useEffect(() => {
    // Загружаем данные при первой загрузке компонента
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    dispatch(deviceLogActions.fetchDeviceLog(userLogFile.id, userLogFile.appSystem.id, userLogFile.company.id));
  }, [dispatch, userLogFile]);

  const buttons: IToolBarButton[] =
    tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { mr: 1 },
            color: 'primary',
            variant: 'contained',
            onClick: handleEdit,
            icon: <EditIcon />,
          },
          {
            name: 'Удалить',
            color: 'secondary',
            variant: 'contained',
            onClick: handleClickOpen,
            icon: <DeleteIcon />,
          },
        ]
      : [];

  const tabs =
    user?.role === 'SuperAdmin'
      ? [
          { name: 'Общая информация', component: <DetailsView details={deviceBindingDetails} /> },
          { name: 'Журнал ошибок', component: <UserDeviceLog deviceLog={deviceLog} /> },
          { name: 'Настройки', component: <UserDeviceSettings appSettings={appSettings} /> },
        ]
      : [
          { name: 'Общая информация', component: <DetailsView details={deviceBindingDetails} /> },
          { name: 'Настройки', component: <UserDeviceSettings appSettings={appSettings} /> },
        ];

  if (!deviceBinding && !bindingLoading && !deviceLoading && !deviceLogLoading) {
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
        <ConfirmDialog
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
          questionText={'Вы действительно хотите удалить привязанное устройство?'}
        />
        <ViewContainer
          handleCancel={handleCancel}
          buttons={buttons}
          loading={bindingLoading || deviceLoading || deviceLogLoading}
          tabValue={tabValue}
          handleChangeTab={handleChangeTab}
          tabs={tabs}
        />
      </Box>
    </>
  );
};

export default UserDeviceView;
