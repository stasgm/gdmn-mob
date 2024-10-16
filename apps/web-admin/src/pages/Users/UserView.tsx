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
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';
import selectors from '../../store/user/selectors';
import bindingSelectors from '../../store/deviceBinding/selectors';
import bindingActions from '../../store/deviceBinding';
import codeActions from '../../store/activationCode';
import { ILinkedEntity, IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import UserDevices from '../../components/user/UserDevices';

import { adminPath } from '../../utils/constants';
import DetailsView from '../../components/DetailsView';

export type Params = {
  id: string;
};

const UserView = () => {
  const { id: userId } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users);
  const user = selectors.userById(userId);
  const userBindingDevices = bindingSelectors.bindingsByUserId(userId);
  const [open, setOpen] = useState(false);

  const userDetails: ILinkedEntity[] = useMemo(
    () =>
      user
        ? [
            { id: 'Пользователь', value: user },
            { id: 'Фамилия', value: user.lastName },
            { id: 'Имя', value: user.firstName },
            { id: 'Отчество', value: user.middleName },
            { id: 'Телефон', value: user.phoneNumber },
            { id: 'Email', value: user.email },
            { id: 'ID из ERP системы', value: user.externalId },
            user.appSystem
              ? { id: 'Подсистема', value: user.appSystem?.name }
              : { id: 'Пользователь ERP', value: user.erpUser?.name },
            { id: 'Компания', value: user.company, link: `${adminPath}/app/companies/${user.company?.id}/` },
          ]
        : [],
    [user],
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/users/${userId}/edit`);
  };

  const handleAddDevice = () => {
    navigate(`${adminPath}/app/users/${userId}/binding/new`);
  };

  const refreshData = useCallback(() => {
    dispatch(actions.fetchUserById(userId));
    dispatch(bindingActions.fetchDeviceBindings(userId));
    dispatch(codeActions.fetchActivationCodes());
  }, [dispatch, userId]);

  useEffect(() => {
    /* Загружаем данные при загрузке компонента */
    refreshData();
  }, [refreshData]);

  const handleDelete = async () => {
    setOpen(false);
    const res = await dispatch(actions.removeUser(userId));
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

  const buttons: IToolBarButton[] = [
    {
      name: 'Обновить',
      sx: { marginRight: 1 },
      color: 'primary',
      variant: 'contained',
      onClick: () => refreshData(),
      icon: <CachedIcon />,
    },
    {
      name: 'Редактировать',
      sx: { marginRight: 1 },
      disabled: true,
      color: 'secondary',
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
  ];

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
          <DetailsView details={userDetails} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Устройства пользователя'} sx={{ mx: 2 }} />
        <UserDevices userId={userId} userBindingDevices={userBindingDevices} onAddDevice={handleAddDevice} />
      </Box>
    </>
  );
};

export default UserView;
