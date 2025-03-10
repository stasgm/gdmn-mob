import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from '../../store';
import { IToolBarButton } from '../../types';
import { processActions, processSelectors } from '../../store/process';
import ProcessDetailsView from '../../components/process/ProcessDetailsView';
import ProcessFilesProcessed from '../../components/process/ProcessFilesProcessed';

import ConfirmDialog from '../../components/ConfirmDialog';
import ViewContainer from '../../components/ViewContainer';

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
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
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
      : [
          {
            name: 'Обновить',
            sx: { mr: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: refreshData,
            icon: <CachedIcon />,
          },
        ];
  }, [refreshData, tabValue]);

  if (!process && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Процесс не найден
      </Box>
    );
  }

  const tabs = process
    ? [
        { name: 'Общая информация', component: <ProcessDetailsView process={process} /> },
        { name: 'Файлы', component: <ProcessFilesProcessed processedFilesList={process.processedFiles} /> },
      ]
    : [];

  return (
    <Box>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        questionText={'Вы действительно хотите удалить процесс?'}
      />
      <ViewContainer
        handleCancel={handleCancel}
        buttons={buttons}
        loading={loading}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        tabs={tabs}
      />
    </Box>
  );
};

export default ProcessView;
