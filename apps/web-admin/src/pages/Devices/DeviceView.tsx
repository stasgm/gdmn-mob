import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { deviceActions, deviceSelectors } from '../../store/device';
import { codeActions, codeSelectors } from '../../store/activationCode';
import { IToolBarButton, ILinkedEntity } from '../../types';

import { adminPath, deviceStates } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';
import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';
import DeviceUsers from '../../components/device/DeviceUsers';

export type Params = {
  id: string;
};

const DeviceView = () => {
  const { id: deviceId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const device = deviceSelectors.deviceById(deviceId);
  const code = codeSelectors.activationCodeByDeviceId(deviceId);

  const [open, setOpen] = useState(false);
  const { loading: deviceLoading, pageParams } = useSelector((state) => state.devices);
  const codeLoading = useSelector((state) => state.activationCodes.loading);
  const [tabValue, setTabValue] = useState(pageParams?.tab || 0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
    dispatch(deviceActions.setPageParam({ tab: newValue }));
  };

  const deviceDetails: ILinkedEntity[] = useMemo(
    () =>
      device
        ? [
            { id: 'Устройство', value: device },
            { id: 'Идентификатор', value: device.id },
            { id: 'Номер', value: device.uid },
            { id: 'Состояние', value: deviceStates[device.state] },
            { id: 'Код активации', value: code },
            { id: 'Компания', value: device.company },
          ]
        : [],
    [device, code],
  );

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/devices/${deviceId}/edit`);
  }, [navigate, deviceId]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(deviceActions.removeDevice(deviceId));
    if (res.type === 'DEVICE/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(codeActions.fetchActivationCodes(deviceId));
  }, [dispatch, deviceId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
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
  }, [handleEdit, refreshData, tabValue]);

  const tabs = [
    { name: 'Общая информация', component: <DetailsView details={deviceDetails} /> },
    {
      name: 'Пользователи',
      component: <DeviceUsers deviceId={deviceId} />, //companyId={device?.company.id}
    },
  ];

  if (!device && !deviceLoading) {
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
    <Box>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить устройство?'}
      />
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={deviceLoading || codeLoading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </Box>
  );
};

export default DeviceView;
