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
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { string } from 'yup';
import { IAppSystem, IMessage, INamedEntity, MessageType } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import appSystemSelectors from '../../store/appSystem/selectors';

import AppSystemDetailsView from '../../components/appSystem/AppSystemDetailsView';
import actions from '../../store/appSystem';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

import AppSystemCompany from '../../components/appSystem/AppSystemCompany';
import company from '../../store/company';

export type Params = {
  id: string;
};

const AppSystemView = () => {
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.appSystems);

  const appSystem = appSystemSelectors.appSystemById(id);

  const [open, setOpen] = useState(false);

  const appSystemDetails: ILinkedEntity[] = useMemo(
    () =>
      appSystem
        ? [
            { id: 'Наименование', value: appSystem },
            { id: 'Описание', value: appSystem?.description },
          ]
        : [],
    [appSystem],
  );

  const nameAppSystem = appSystem;
  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/appSystems/${id}/edit`);
  };

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(actions.removeAppSystem(id));
    if (res.type === 'APP_SYSTEM/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(actions.fetchAppSystemById(id));
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
    dispatch(actions.clearError());
  };

  if (!appSystem) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Подсистема не найдена
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

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Вы действительно хотите удалить подсистему?</DialogContentText>
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
          <DetailsView details={appSystemDetails} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Компании с подсистеммой ' + appSystem.name} sx={{ mx: 2 }} />
        <AppSystemCompany appSystem={appSystem} />
      </Box>
    </>
  );
};

export default AppSystemView;
