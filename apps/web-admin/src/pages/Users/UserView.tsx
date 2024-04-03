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
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from '../../store';
import { userActions, userSelectors } from '../../store/user';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import UserDevices from '../../components/user/UserDevices';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';
import TabPanel from '../../components/TabPanel';

export type Params = {
  id: string;
};

const UserView = () => {
  const { id: userId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users);
  const user = userSelectors.userById(userId);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const userDetails: ILinkedEntity[] = useMemo(
    () =>
      user
        ? [
            { id: 'Пользователь', value: user },
            { id: 'Идентификатор', value: user.id },
            { id: 'Фамилия', value: user.lastName },
            { id: 'Имя', value: user.firstName },
            { id: 'Отчество', value: user.middleName },
            { id: 'Телефон', value: user.phoneNumber },
            { id: 'Email', value: user.email },
            { id: 'Идентификатор из ERP', value: user.externalId },
            user.appSystem
              ? { id: 'Подсистема', value: user.appSystem.name }
              : { id: 'Пользователь ERP', value: user.erpUser?.name },
            { id: 'Компания', value: user.company, link: `${adminPath}/app/companies/${user.company?.id}/` },
          ]
        : [],
    [user],
  );

  const handleEdit = useCallback(() => {
    navigate(`${adminPath}/app/users/${userId}/edit`);
  }, [navigate, userId]);

  const refreshData = useCallback(() => {
    dispatch(userActions.fetchUserById(userId));
    // dispatch(bindingActions.fetchDeviceBindings(userId));
    // dispatch(codeActions.fetchActivationCodes());
  }, [dispatch, userId]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    refreshData();
  }, [refreshData]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(userActions.removeUser(userId));
    if (res.type === 'USER/REMOVE_SUCCESS') {
      navigate(-1);
    }
  };

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
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: () => refreshData(),
            icon: <CachedIcon />,
          },
          {
            name: 'Редактировать',
            sx: { marginRight: 1 },
            disabled: true,
            color: 'primary',
            variant: 'contained',
            onClick: () => handleEdit(),
            icon: <EditIcon />,
          },
          {
            name: 'Удалить',
            disabled: true,
            color: 'secondary',
            variant: 'contained',
            onClick: () => handleClickOpen(),
            icon: <DeleteIcon />,
          },
        ]
      : [
          {
            name: 'Обновить',
            sx: { marginRight: 1 },
            color: 'secondary',
            variant: 'contained',
            onClick: () => refreshData(),
            icon: <CachedIcon />,
          },
        ];
  }, [handleEdit, refreshData, tabValue]);

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
        }}
      >
        Пользователь не найден
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">
              {user.role === 'Admin'
                ? 'Вы действительно хотите удалить пользователя, являющегося администратором?'
                : 'Вы действительно хотите удалить пользователя?'}
            </DialogContentText>
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
            <Tab label="Устройства" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DetailsView details={userDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <UserDevices userId={userId} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default UserView;
