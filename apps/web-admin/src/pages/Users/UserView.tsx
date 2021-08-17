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
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IDeviceBinding, IDevice } from '@lib/types';

import { useSelector, useDispatch } from '../../store';
import actions from '../../store/user';
import selectors from '../../store/user/selectors';
import deviceSelectors from '../../store/device/selectors';
import bindingSelectors from '../../store/deviceBinding/selectors';
import bindingActions from '../../store/deviceBinding';
import deviceActions from '../../store/device';
import { IToolBarButton } from '../../types';
import ToolBarAction from '../../components/ToolBarActions';
import UserDetailsView from '../../components/user/UserDetailsView';
import UserDevices from '../../components/user/UserDevices';
import SnackBar from '../../components/SnackBar';

import { adminPath } from '../../utils/constants';

const UserView = () => {
  const { id: userId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.users);
  const user = selectors.userById(userId);

  const userBindingDevices = bindingSelectors.bindingsByUserId(userId);

  const { list } = useSelector((state) => state.devices);

  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`${adminPath}/app/users/${userId}/edit`);
  };

  const handleAddDevice = () => {
    navigate(`${adminPath}/app/users/${userId}/binding/new`);
  };

  const handleClearError = () => {
    dispatch(actions.userActions.clearError());
  };

  const refreshData = useCallback(() => {
    dispatch(actions.fetchUserById(userId));
    dispatch(bindingActions.fetchDeviceBindings(userId));
    dispatch(deviceActions.fetchDevices());
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

  // const userDevices = userBindingDevices.map((binding: IDeviceBinding) => {
  //   return list.find((a) => binding.device.id === a.id);
  // });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userDevices: IDevice[] = [];

  const data = useMemo(
    () =>
      userBindingDevices.forEach((binding: IDeviceBinding) => {
        const dev = list.find((a) => binding.device.id === a.id);
        // /*return*/ list.find((a) => binding.device.id === a.id);
        console.log('dev', dev);
        if (dev) {
          userDevices.push(dev);
        }
        return { dev };
      }),
    [userBindingDevices, userDevices, list],
  );

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
      onClick: () => handleClickOpen(), //handleDelete(),
      icon: <DeleteIcon />,
    },
  ];

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText color="black">Удалить пользователя?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color="primary">
              Да
            </Button>
            <Button onClick={handleClose} color="primary" /*autoFocus*/>
              Нет
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
          <UserDetailsView user={user} />
        </Box>
      </Box>
      <Box>
        <CardHeader title={'Устройства пользователя'} sx={{ mx: 2 }} />
        <UserDevices userDevices={userDevices} userBindingDevices={userBindingDevices} onAddDevice={handleAddDevice} />
      </Box>
      <SnackBar errorMessage={errorMessage} onClearError={handleClearError} />
    </>
  );
};

export default UserView;
