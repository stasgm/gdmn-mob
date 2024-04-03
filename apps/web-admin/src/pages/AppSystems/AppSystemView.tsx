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
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useSelector, useDispatch } from '../../store';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';

import { appSystemActions, appSystemSelectors } from '../../store/appSystem';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

import AppSystemCompany from '../../components/appSystem/AppSystemCompany';
import TabPanel from '../../components/TabPanel';

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
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const appSystemDetails: ILinkedEntity[] = useMemo(
    () =>
      appSystem
        ? [
            { id: 'Подсистема', value: appSystem },
            { id: 'Идентификатор', value: appSystem?.id },
            { id: 'Описание', value: appSystem?.description },
          ]
        : [],
    [appSystem],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/appSystems/${id}/edit`);
  }, [navigate, id]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(appSystemActions.removeAppSystem(id));
    if (res.type === 'APP_SYSTEM/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

  const refreshData = useCallback(() => {
    dispatch(appSystemActions.fetchAppSystemById(id));
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
            name: 'Редактировать',
            sx: { marginRight: 1 },
            disabled: true,
            color: 'primary',
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
  }, [handleEdit, refreshData, tabValue]);

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
            <Tab label="Компании" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DetailsView details={appSystemDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AppSystemCompany appSystem={appSystem} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default AppSystemView;
