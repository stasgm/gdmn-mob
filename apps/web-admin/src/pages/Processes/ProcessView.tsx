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

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import { processActions, processSelectors } from '../../store/process';
import ToolBarAction from '../../components/ToolBarActions';
import ProcessDetailsView from '../../components/process/ProcessDetailsView';
import ProcessFilesProcessed from '../../components/process/ProcessFilesProcessed';
import CircularProgressWithContent from '../../components/CircularProgressWidthContent';
import TabPanel from '../../components/TabPanel';

export type Params = {
  id: string;
};

const ProcessView = () => {
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.processes);
  const process = processSelectors.processById(id);
  const [open, setOpen] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

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
    dispatch(processActions.fetchProcesses());
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

  if (!process) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        {loading ? <CircularProgressWithContent content={'Идет загрузка данных...'} /> : 'Процесс не найден'}
      </Box>
    );
  }

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
        <Box>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Общая информация" />
            <Tab label="Файлы" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <ProcessDetailsView process={process} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ProcessFilesProcessed processedFilesList={process.processedFiles} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default ProcessView;
