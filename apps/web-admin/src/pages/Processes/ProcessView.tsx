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
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import processSelectors from '../../store/process/selectors';
import companySelectors from '../../store/company/selectors';
import SnackBar from '../../components/SnackBar';

import { adminPath } from '../../utils/constants';
import ProcessDetailsView from '../../components/process/ProcessDetailsView';
import processActions from '../../store/process';

export type Params = {
  processId: string;
};

const ProcessView = () => {
  const { processId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.processes);

  const process = processSelectors.processById(processId);
  const company = companySelectors.companyById(process.companyId);

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  // const handleEdit = () => {
  //   navigate(`${adminPath}/app/compaines/${processs?.}/binding/${bindingid}/edit`);
  //   // <NavLink to={`${adminPath}/app/users/${binding.user.id}/binding/${binding.id}`}></NavLink>
  // };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(processActions.removeProcess(processId));
    if (res.type === 'PROCESS/REMOVE_SUCCES') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    //dispatch(deviceActions.fetchDeviceById(deviceId));
    dispatch(processActions.fetchProcesses());
    //dispatch(userActions.fetchUsers());
    //dispatch(codeActions.fetchActivationCodes(deviceId));
  }, [dispatch /*, deviceId*/]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // const fetchUsers = useCallback(
  //   (filterText?: string, fromRecord?: number, toRecord?: number) => {
  //     dispatch(userActions.fetchUsers('', filterText, fromRecord, toRecord));
  //   },
  //   [dispatch],
  // );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

  const handleClearError = () => {
    dispatch(processActions.processActions.clearError());
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
        Процесс не найден
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
    // {
    //   name: 'Редактировать',
    //   sx: { marginRight: 1 },
    //   disabled: true,
    //   color: 'secondary',
    //   variant: 'contained',
    //   onClick: handleEdit,
    //   icon: <EditIcon />,
    // },
    {
      name: 'Удалить',
      disabled: true,
      color: 'secondary',
      variant: 'contained',
      onClick: handleClickOpen, //handleDelete,
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
          <ProcessDetailsView process={process} />
        </Box>
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default ProcessView;
