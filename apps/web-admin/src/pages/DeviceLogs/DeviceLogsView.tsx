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
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import processSelectors from '../../store/process/selectors';
import deviceLogSelectors from '../../store/deviceLog/selectors';
import SnackBar from '../../components/SnackBar';

import DeviceLogsDetailsView from '../../components/deviceLogs/DeviceLogsDetailsView';
import deviceLogActions from '../../store/deviceLog';
import ProcessFiles from '../../components/process/ProcessFiles';
import ProcessFilesProcessed from '../../components/process/ProcessFilesProcessed';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import DeviceLogTable from '../../components/deviceLogs/DeviceLogTable';

export type Params = {
  id: string;
};

const DeviceLogsView = () => {
  const { id } = useParams<keyof Params>() as Params;
  console.log('id', id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage, list, pageParams } = useSelector((state) => state.deviceLogs);

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
  // const company = process?.companyId ? companySelectors.companyById(process.companyId) : undefined;
  // const appSystem = process?.appSystemId ? appSystemSelectors.appSystemById(process.appSystemId) : undefined;

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(processActions.removeProcess(id));
    if (res.type === 'PROCESS/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(deviceLogActions.fetchDeviceLogs());
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

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить процесс?</DialogContentText>
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
          <DeviceLogsDetailsView deviceLogs={process} />
        </Box>
        <Box>
          <CardHeader sx={{ mx: 2 }} />
          <DeviceLogTable deviceLog={list} />
        </Box>
        {/*  <Box>
          <CardHeader sx={{ mx: 2 }} />
          <ProcessFilesProcessed processedFilesList={process.processedFiles} />
        </Box> */}
      </Box>

      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default DeviceLogsView;
