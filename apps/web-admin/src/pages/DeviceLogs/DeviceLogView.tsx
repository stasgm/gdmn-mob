import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';

import { IDeviceLogEntry } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import { IHeadCells, ILinkedEntity, IToolBarButton } from '../../types';

import { deviceLogActions, deviceLogSelectors } from '../../store/deviceLog';
import SortableTable from '../../components/SortableTable';
import DetailsView from '../../components/DetailsView';
import { adminPath } from '../../utils/constants';
import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';

const headCells: IHeadCells<IDeviceLogEntry>[] = [
  { id: 'name', label: 'Функция', sortEnable: true, filterEnable: true },
  { id: 'message', label: 'Сообщение', sortEnable: true, filterEnable: true },
  { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true, type: 'date' },
];

export type Params = {
  id: string;
};

const DeviceLogView = () => {
  const { id: logFileId } = useParams<keyof Params>() as Params;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, deviceLog } = useSelector((state) => state.deviceLogs);
  const deviceLogFile = deviceLogSelectors.deviceLogFileById(logFileId);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchDeviceLogs = useCallback(() => {
    dispatch(deviceLogActions.fetchDeviceLogFiles());
  }, [dispatch]);

  useEffect(() => {
    if (deviceLogFile) {
      dispatch(deviceLogActions.fetchDeviceLog(logFileId, deviceLogFile.appSystem.id, deviceLogFile.company.id));
    }
  }, [deviceLogFile, dispatch, logFileId]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogs();
  }, [fetchDeviceLogs]);

  const deviceLogsDetails: ILinkedEntity[] = useMemo(
    () =>
      deviceLogFile
        ? [
            {
              id: 'Компания',
              value: deviceLogFile.company,
              link: `${adminPath}/app/companies/${deviceLogFile.company.id}/`,
            },
            {
              id: 'Подсистема',
              value: deviceLogFile?.appSystem,
              link: `${adminPath}/app/appSystems/${deviceLogFile.appSystem.id}/`,
            },
            {
              id: 'Устройство',
              value: deviceLogFile.device,
              link: `${adminPath}/app/devices/${deviceLogFile.device.id}/`,
            },
            { id: 'Идентификатор устройства', value: deviceLogFile?.device.id },
            {
              id: 'Пользователь',
              value: deviceLogFile?.producer,
              link: `${adminPath}/app/users/${deviceLogFile.producer.id}/`,
            },
          ]
        : [],
    [deviceLogFile],
  );

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = useCallback(async () => {
    setOpen(false);
    const res = await dispatch(
      deviceLogActions.deleteDeviceLog(
        logFileId,
        deviceLogFile?.folder || '',
        deviceLogFile?.appSystem?.id || '',
        deviceLogFile?.company?.id || '',
      ),
    );
    if (res.type === 'DEVICE_LOG/REMOVE_DEVICE_LOG_SUCCESS') {
      navigate(-1);
    }
  }, [deviceLogFile, dispatch, navigate, logFileId]);

  // const refreshData = useCallback(() => {
  //   dispatch(
  //     deviceLogActions.fetchDeviceLog(
  //       logFileId,
  //       deviceLogFile?.folder || '',
  //       deviceLogFile?.appSystem?.id || '',
  //       deviceLogFile?.company?.id || '',
  //     ),
  //   );
  // }, [dispatch, logFileId, deviceLogFile?.appSystem?.id, deviceLogFile?.company?.id, deviceLogFile?.folder]);

  // useEffect(() => {
  //   refreshData();
  // }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tabs = [
    { name: 'Общая информация', component: <DetailsView details={deviceLogsDetails} /> },
    { name: 'Содержимое', component: <SortableTable<IDeviceLogEntry> headCells={headCells} data={deviceLog} /> },
  ];

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: fetchDeviceLogs,
            icon: <CachedIcon />,
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
  }, [fetchDeviceLogs, tabValue]);

  if (!deviceLogFile && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Сообщение не найдено
      </Box>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить журнал ошибок?'}
      />
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={loading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </>
  );
};

export default DeviceLogView;
