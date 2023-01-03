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
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { IDeviceLog } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import { IHeadCells, ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import deviceLogSelectors from '../../store/deviceLog/selectors';
import SnackBar from '../../components/SnackBar';
import deviceLogActions from '../../store/deviceLog';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SortableTable from '../../components/SortableTable';
import DetailsView from '../../components/DetailsView';
import { adminPath } from '../../utils/constants';

export type Params = {
  id: string;
};

const DeviceLogView = () => {
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage, logList, pageParams } = useSelector((state) => state.deviceLogs);

  const fetchDeviceLogs = useCallback(
    (filterText?: string, fromRecord?: number, toRecord?: number) => {
      dispatch(deviceLogActions.fetchDeviceLog(id));
    },
    [dispatch, id],
  );

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLogs(pageParams?.filterText as string);
  }, [fetchDeviceLogs, pageParams?.filterText]);

  const process = deviceLogSelectors.deviceLogById(id);

  const deviceLogsDetails: ILinkedEntity[] = useMemo(
    () =>
      process
        ? [
            { id: 'Компания', value: process.company, link: `${adminPath}/app/companies/${process.company.id}/` },
            {
              id: 'Подсистема',
              value: process?.appSystem,
              link: `${adminPath}/app/appSystems/${process.appSystem.id}/`,
            },
            { id: 'Устройство', value: process.device, link: `${adminPath}/app/devices/${process.device.id}/` },
            { id: 'Идентификатор устройства', value: process?.device.id },
            { id: 'Пользователь', value: process?.contact, link: `${adminPath}/app/users/${process.contact.id}/` },
          ]
        : [],
    [process],
  );

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(deviceLogActions.removeDeviceLog(id));
    if (res.type === 'DEVICE_LOG/REMOVE_DEVICE_LOG_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceLogActions.fetchDeviceLog(id));
  }, [dispatch, id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearError = () => {
    dispatch(deviceLogActions.deviceLogActions.clearError());
  };

  if (!process) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        {loading ? <CircularProgressWithContent content={'Идет загрузка данных...'} /> : 'Сообщение не найдено'}
      </Box>
    );
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
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleClickOpen,
      icon: <DeleteIcon />,
    },
  ];

  const headCells: IHeadCells<IDeviceLog>[] = [
    { id: 'name', label: 'Функция', sortEnable: true, filterEnable: true },
    { id: 'message', label: 'Сообщение', sortEnable: true, filterEnable: true },
    { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true },
  ];

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить журнал ошибок?</DialogContentText>
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
          <DetailsView details={deviceLogsDetails} />
        </Box>
        <Box sx={{ pt: 2 }}>
          <SortableTable<IDeviceLog> headCells={headCells} data={logList} path={'/app/deviceLogs/'} />
        </Box>
      </Box>

      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceLogView;
