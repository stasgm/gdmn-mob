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
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IDeviceLogEntry } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import { IHeadCells, ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import { deviceLogActions, deviceLogSelectors } from '../../store/deviceLog';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import SortableTable from '../../components/SortableTable';
import DetailsView from '../../components/DetailsView';
import { adminPath } from '../../utils/constants';
import TabPanel from '../../components/TabPanel';

const headCells: IHeadCells<IDeviceLogEntry>[] = [
  { id: 'name', label: 'Функция', sortEnable: true, filterEnable: true },
  { id: 'message', label: 'Сообщение', sortEnable: true, filterEnable: true },
  { id: 'date', label: 'Дата', sortEnable: true, filterEnable: true },
];

export type Params = {
  id: string;
};

const DeviceLogView = () => {
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, deviceLog } = useSelector((state) => state.deviceLogs);

  const deviceLogFile = deviceLogSelectors.deviceLogFileById(id);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchDeviceLog = useCallback(() => {
    dispatch(
      deviceLogActions.fetchDeviceLog(
        id,
        deviceLogFile?.folder || '',
        deviceLogFile?.appSystem?.id || '',
        deviceLogFile?.company?.id || '',
      ),
    );
  }, [dispatch, id, deviceLogFile]);

  useEffect(() => {
    // Загружаем данные при загрузке компонента.
    fetchDeviceLog();
  }, [fetchDeviceLog]);

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
        id,
        deviceLogFile?.folder || '',
        deviceLogFile?.appSystem?.id || '',
        deviceLogFile?.company?.id || '',
      ),
    );
    if (res.type === 'DEVICE_LOG/REMOVE_DEVICE_LOG_SUCCESS') {
      navigate(-1);
    }
  }, [deviceLogFile, dispatch, id, navigate]);

  const refreshData = useCallback(() => {
    dispatch(
      deviceLogActions.fetchDeviceLog(
        id,
        deviceLogFile?.folder || '',
        deviceLogFile?.appSystem?.id || '',
        deviceLogFile?.company?.id || '',
      ),
    );
  }, [dispatch, id, deviceLogFile?.appSystem?.id, deviceLogFile?.company?.id, deviceLogFile?.folder]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttons: IToolBarButton[] = useMemo(() => {
    return tabValue === 0
      ? [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
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
        ]
      : [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
        ];
  }, [refreshData, tabValue]);

  if (!deviceLogFile) {
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
        <Box>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Общая информация" />
            <Tab label="Содержимое" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DetailsView details={deviceLogsDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SortableTable<IDeviceLogEntry> headCells={headCells} data={deviceLog} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default DeviceLogView;
